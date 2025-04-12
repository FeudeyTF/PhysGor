import { useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";
import { FaTags, FaChevronDown, FaChevronUp } from "react-icons/fa";

type TrainingCardProps = {
  law: PhysicsLaw;
};

export function TrainingCard(props: TrainingCardProps) {
  const { law } = props;
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  return (
    <div className="training-card-container" onClick={handleFlip}>
      <div className={`training-card ${isFlipped ? "flipped" : ""}`}>
        <div className="training-card-front">
          <div className="training-card-category">
            {translatePhysicsCategory(law.category)}
          </div>
          <h2 className="training-card-title">{law.name}</h2>
          <div className="flip-hint">
            <span>Нажмите, чтобы перевернуть...</span>
          </div>
        </div>

        <div className="training-card-back">
          <div className="back-content">
            <div className="training-card-category">
              {translatePhysicsCategory(law.category)}
            </div>
            <h3 className="training-card-name">{law.name}</h3>

            <div className="training-card-description">
              <p>{law.description}</p>
              
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
              <div className="training-card-formula">
                <span>Формула:</span>
                <FormulaParser formula={law.formula} />
              </div>
            )}

            <div className="training-card-meta">
              {law.discoveredBy && <p>Закон открыл: {law.discoveredBy || "Не указано"}</p>}
            </div>
          </div>

          <div className="flip-hint">
            <span>Нажмите, чтобы спрятать...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
