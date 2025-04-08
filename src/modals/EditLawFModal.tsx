import { useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { Difficulty } from "../types/Difficulty";
import { FaTimes } from "react-icons/fa";
import RichTextEditor from "../components/RichTextEditor";

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
    formula: law.formula || "",
    category: law.category,
    difficulty: law.difficulty,
    class: law.class,
    year: law.year || new Date().getFullYear(),
    discoveredBy: law.discoveredBy || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    let parsedValue: any = value;
    if (name === "category") {
      parsedValue = value as PhysicsCategory;
      console.log(`Setting category to: ${value}`);
    } else if (name === "difficulty") {
      parsedValue = value as Difficulty;
      console.log(`Setting difficulty to: ${value}`);
    } else if (name === "class" || name === "year") {
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

  const handleRichTextChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));

    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
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

    if (formData.class < 1 || formData.class > 11) {
      newErrors.class = "Класс должен быть от 1 до 11";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (!law.id) {
        throw new Error("Cannot update law without ID");
      }

      console.log("Submitting form with data:", formData);
      const result = await onSubmit(law.id, formData);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-law-overlay">
      <motion.div
        className="add-law-form"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="form-header">
          <h2>Редактировать закон физики</h2>
          <button
            className="close-button"
            onClick={onCancel}
            title="Закрыть форму"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Название закона*:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Например: Закон Ома для участка цепи"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание*:</label>
            <RichTextEditor
              value={formData.description}
              onChange={handleRichTextChange}
              className={errors.description ? "error" : ""}
              placeholder="Описание закона..."
              rows={4}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="formula">Формула (необязательно):</label>
            <input
              type="text"
              id="formula"
              name="formula"
              value={formData.formula || ""}
              onChange={handleChange}
              placeholder="Например: F = ma"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категория*:</label>
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
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Сложность*:</label>
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
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Класс*:</label>
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
              {errors.class && (
                <span className="error-message">{errors.class}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="year">Год открытия:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="discoveredBy">Автор закона:</label>
            <input
              type="text"
              id="discoveredBy"
              name="discoveredBy"
              value={formData.discoveredBy || ""}
              onChange={handleChange}
              placeholder="Имя учёного, открывшего этот закон"
            />
          </div>

          {errors.submit && <div className="form-error">{errors.submit}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
