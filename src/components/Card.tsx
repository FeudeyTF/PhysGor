import { useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { difficultyToColor } from "../types/Difficulty";
import { FaBook, FaTrash, FaEdit, FaBookmark, FaStickyNote } from "react-icons/fa";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";

type CardProps = {
  law: PhysicsLaw;
  onDelete?: (id: string) => void;
  onEdit?: (law: PhysicsLaw) => void;
};

export function Card(props: CardProps) {
  const { law, onDelete, onEdit } = props;
  const [activeNotes, setActiveNotes] = useState<boolean[]>([]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (law.id && onDelete) {
      if (window.confirm(`Вы уверены, что хотите удалить "${law.name}"?`)) {
        onDelete(law.id);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(law);
    }
  };

  const toggleNote = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveNotes(prev => {
      const newActiveNotes = [...prev];
      newActiveNotes[index] = !newActiveNotes[index];
      return newActiveNotes;
    });
  };

  return (
    <motion.div
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="card">
        {law.class && (
          <div className="class-badge">
            <FaBook />
            <span>{law.class} класс</span>
          </div>
        )}

        <div className="card-actions">
          {law.difficulty && (
            <div
              className="difficulty-badge"
              style={{ backgroundColor: difficultyToColor(law.difficulty) }}
            >
              {law.difficulty}
            </div>
          )}
          {onDelete && law.id && (
            <motion.button
              className="delete-button"
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Удалить закон"
            >
              <FaTrash />
            </motion.button>
          )}

          {onEdit && law.id && (
            <motion.button
              className="edit-button"
              onClick={handleEdit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Редактировать закон"
            >
              <FaEdit />
            </motion.button>
          )}
        </div>

        <div className="card-category">
          {translatePhysicsCategory(law.category)}
        </div>
        <h2 className="card-title">{law.name}</h2>

        <div className="card-content">
          <div className="card-description">
            <div dangerouslySetInnerHTML={{ __html: law.description }} />
            
            {law.notes && law.notes.length > 0 && (
              <div className="note-buttons-container">
                {law.notes.map((note, index) => (
                  <div key={index} className="note-item">
                    <motion.button
                      className={`note-button ${activeNotes[index] ? 'active' : ''}`}
                      onClick={(e) => toggleNote(e, index)}
                      title={note.title}
                    >
                      <FaStickyNote />
                      <span>Примечание {index + 1}</span>
                    </motion.button>
                    
                    {activeNotes[index] && (
                      <motion.div
                        className="note-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="noted-text-header">
                          <FaBookmark /> <span>{note.title}</span>
                        </div>
                        <div className="noted-text-content" dangerouslySetInnerHTML={{ __html: note.text }} />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {law.formula && (
            <div className="card-formula">
              <span>Формула:</span>
              <FormulaParser formula={law.formula} />
            </div>
          )}

          <div className="card-meta">
            <p>Закон открыл: {law.discoveredBy || "Не указано"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
