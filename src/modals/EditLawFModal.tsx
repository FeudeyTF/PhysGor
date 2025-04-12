import { ChangeEvent, FormEvent, useState } from "react";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { Difficulty } from "../types/Difficulty";
import { RichTextEditor } from "../components/RichTextEditor";
import { ModalWindow } from "./Modal";
import { FormulaParser } from "../components/FormulaParser";
import { FaPlus, FaTrash } from "react-icons/fa";

type EditLawFormProps = {
  law: PhysicsLaw;
  onSubmit: (
    id: string,
    law: Omit<PhysicsLaw, "id">
  ) => Promise<{ success: boolean; law?: PhysicsLaw; error?: string }>;
  onCancel: () => void;
};

export function EditLawForm(props: EditLawFormProps) {
  const { law, onSubmit, onCancel } = props;
  const [formData, setFormData] = useState<Omit<PhysicsLaw, "id">>({
    name: law.name,
    description: law.description,
    notes: law.notes || [],
    formula: law.formula || "",
    category: law.category,
    difficulty: law.difficulty,
    class: law.class,
    discoveredBy: law.discoveredBy || "",
    topic: law.topic || "",
    subtopic: law.subtopic || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotes, setShowNotes] = useState(
    Boolean(law.notes && law.notes.length > 0)
  );

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    let parsedValue: any = value;
    if (name === "category") {
      parsedValue = value as PhysicsCategory;
    } else if (name === "difficulty") {
      parsedValue = value as Difficulty;
    } else if (name === "class") {
      parsedValue = parseInt(value, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRichTextChange = (field: "description" | "text", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNoteChange = (index: number, field: 'title' | 'text', value: string) => {
    setFormData((prev) => {
      const newNotes = [...(prev.notes || [])];
      if (newNotes[index]) {
        newNotes[index] = { ...newNotes[index], [field]: value };
      }
      return {
        ...prev,
        notes: newNotes,
      };
    });
  };

  const addNote = () => {
    setFormData((prev) => ({
      ...prev,
      notes: [...(prev.notes || []), { title: "", text: "" }],
    }));
  };

  const removeNote = (index: number) => {
    setFormData((prev) => {
      const newNotes = [...(prev.notes || [])];
      newNotes.splice(index, 1);
      return {
        ...prev,
        notes: newNotes,
      };
    });
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
    
    if (!showNotes && (!formData.notes || formData.notes.length === 0)) {
      setFormData((prev) => ({
        ...prev,
        notes: [{ title: "", text: "" }],
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название закона обязательно";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание закона обязательно";
    }

    if (showNotes && formData.notes && formData.notes.length > 0) {
      const invalidIndex = formData.notes.findIndex(
        (item) => !item.title.trim() || !item.text.trim()
      );
      if (invalidIndex >= 0) {
        newErrors.notes = "Все названия и тексты должны быть заполнены";
      }
    }

    if (formData.class < 1 || formData.class > 11) {
      newErrors.class = "Класс должен быть от 1 до 11";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (!law.id) {
        throw new Error("Нельзя обновить закон без ID");
      }

      const dataToSubmit = {
        ...formData,
        notes: showNotes ? formData.notes : [],
      };

      const result = await onSubmit(law.id, dataToSubmit);
      if (result.success) {
        onCancel();
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: result.error || "Ошибка при обновлении закона",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: "Произошла ошибка при отправке",
      }));
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWindow
      title="Редактировать закон"
      onClose={onCancel}
      onSubmit={handleSubmit}
      error={errors.submit}
      submitButton={
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </button>
      }
    >
      <ModalWindow.Group title="Название закона*" error={errors.name}>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
          placeholder="Например: Закон Ома для участка цепи"
        />
      </ModalWindow.Group>

      <ModalWindow.Group title="Описание*" error={errors.description}>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => handleRichTextChange("description", value)}
          className={errors.description ? "error" : ""}
          placeholder="Описание закона..."
          rows={4}
        />
      </ModalWindow.Group>
      
      <div className="text-mode-toggle">
        <label>
          <div className="toggle-checkbox">
            <input 
              type="checkbox" 
              checked={showNotes}
              onChange={toggleNotes}
            />
            <span className="toggle-switch"></span>
          </div>
          <span className="toggle-text">
            Добавить примечания
          </span>
        </label>
      </div>

      {showNotes && (
        <ModalWindow.Group title="Примечания" error={errors.notes}>
          {formData.notes && formData.notes.map((note, index) => (
            <div key={index} className="noted-text-editor">
              <div className="noted-text-header">
                <div className="title-input-container">
                  <input
                    type="text"
                    placeholder="Название"
                    value={note.title}
                    onChange={(e) => handleNoteChange(index, 'title', e.target.value)}
                  />
                </div>
                <button 
                  type="button" 
                  className="remove-noted-text-button"
                  onClick={() => removeNote(index)}
                >
                  <FaTrash />
                </button>
              </div>
              <RichTextEditor
                value={note.text}
                onChange={(value) => handleNoteChange(index, 'text', value)}
                placeholder="Текст примечания..."
                rows={3}
              />
            </div>
          ))}
          <button 
            type="button" 
            className="add-noted-text-button"
            onClick={addNote}
          >
            <FaPlus /> Добавить примечание
          </button>
        </ModalWindow.Group>
      )}
      
      <ModalWindow.Group title="Формула (необязательно)" error={errors.formula}>
        <input
          type="text"
          id="formula"
          name="formula"
          value={formData.formula || ""}
          onChange={handleChange}
          placeholder="Например: F = ma"
        />
        {formData.formula && <FormulaParser formula={formData.formula} />}
      </ModalWindow.Group>
      <ModalWindow.Row>
        <ModalWindow.Group title="Категория*">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {Object.values(PhysicsCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </ModalWindow.Group>
        <ModalWindow.Group title="Сложность*">
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            {Object.values(Difficulty).map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </ModalWindow.Group>
      </ModalWindow.Row>
      <ModalWindow.Row>
        <ModalWindow.Group title="Класс*" error={errors.class}>
          <input
            type="number"
            id="class"
            name="class"
            min="1"
            max="11"
            value={formData.class}
            onChange={handleChange}
            className={errors.class ? "error" : ""}
          />
        </ModalWindow.Group>
      </ModalWindow.Row>
      <ModalWindow.Row>
        <ModalWindow.Group title="Тема">
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Например: Кинематика"
          />
        </ModalWindow.Group>
        <ModalWindow.Group title="Подтема">
          <input
            type="text"
            id="subtopic"
            name="subtopic"
            value={formData.subtopic}
            onChange={handleChange}
            placeholder="Например: Движение по окружности"
          />
        </ModalWindow.Group>
      </ModalWindow.Row>
      <ModalWindow.Group title="Автор закона">
        <input
          type="text"
          id="discoveredBy"
          name="discoveredBy"
          value={formData.discoveredBy || ""}
          onChange={handleChange}
          placeholder="Имя учёного, открывшего этот закон"
        />
      </ModalWindow.Group>
    </ModalWindow>
  );
}
