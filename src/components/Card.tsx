import { useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { difficultyToColor } from "../types/Difficulty";
import { FaBook, FaTrash, FaEdit, FaTags, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";

type CardProps = {
  law: PhysicsLaw;
  onDelete?: (id: string) => void;
  onEdit?: (law: PhysicsLaw) => void;
};

export function Card(props: CardProps) {
  const { law, onDelete, onEdit } = props;
  const [showNotes, setShowNotes] = useState(false);

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

  const toggleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
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
              <>
                <motion.button 
                  className="notes-toggle-button"
                  onClick={toggleNotes}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={showNotes ? "Скрыть примечания" : "Показать примечания"}
                >
                  {showNotes ? <FaChevronUp /> : <FaChevronDown />}
                  <span>{showNotes ? "Скрыть примечания" : "Показать примечания"} ({law.notes.length})</span>
                </motion.button>
                
                {showNotes && (
                  <motion.div 
                    className="noted-texts"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {law.notes.map((note, index) => (
                      <div key={index} className="noted-text">
                        <div className="noted-text-header">
                          <FaTags /> <span>{note.title}</span>
                        </div>
                        <div className="noted-text-content" dangerouslySetInnerHTML={{ __html: note.text }} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </>
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
