import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { DifficultyToColor } from "../types/Difficulty";
import { FaBook } from "react-icons/fa";

type CardProps = {
  law: PhysicsLaw;
};

export function Card(props: CardProps) {
  const { law } = props;

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
            style={{ backgroundColor: DifficultyToColor(law.difficulty) }}
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

        <div className="card-category">{law.category}</div>
        <h2 className="card-title">{law.name}</h2>

        <div className="card-content">
          <div className="card-description">
            <p>{law.description}</p>
          </div>

          {law.formula && (
            <div className="card-formula">
              <span>Формула:</span>
              <div className="formula-text">{law.formula}</div>
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
