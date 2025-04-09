import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { difficultyToColor } from "../types/Difficulty";
import { FaBook, FaTrash, FaEdit } from "react-icons/fa";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";

type CardProps = {
  law: PhysicsLaw;
  onDelete?: (id: string) => void;
  onEdit?: (law: PhysicsLaw) => void;
};

export function Card(props: CardProps) {
  const { law, onDelete, onEdit } = props;

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

  return (
    <motion.div
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="card">
        {law.difficulty && (
          <div
            className="difficulty-badge"
            style={{ backgroundColor: difficultyToColor(law.difficulty) }}
          >
            {law.difficulty}
          </div>
        )}

        {law.year && (
          <div className="year-badge">
            <span>{law.year}</span>
          </div>
        )}

        {law.class && (
          <div className="class-badge">
            <FaBook />
            <span>{law.class} класс</span>
          </div>
        )}

        <div className="card-actions">
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
          </div>

          {law.formula && (
            <div className="card-formula">
              <span>Формула:</span>
              <FormulaParser formula={law.formula} />
            </div>
          )}

          <div className="card-meta">
            {law.discoveredBy && <p>Закон открыл: {law.discoveredBy}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
