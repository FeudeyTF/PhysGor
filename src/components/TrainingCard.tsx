import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";
import { FaStickyNote, FaBookmark } from "react-icons/fa";
import { RichTextRenderer } from "./RichTextRenderer";

type TrainingCardProps = {
  law: PhysicsLaw;
};

export function TrainingCard(props: TrainingCardProps) {
  const { law } = props;
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeNotes, setActiveNotes] = useState<boolean[]>([]);

  useEffect(() => {
    if (law.notes && law.notes.length > 0) {
      setActiveNotes(new Array(law.notes.length).fill(false));
    } else {
      setActiveNotes([]);
    }
  }, [law]);

  useEffect(() => {
    if (isFlipped && law.notes && law.notes.length > 0) {
      const timerId = setTimeout(() => {
        setActiveNotes((prev) => {
          const newActiveNotes = [...prev];
          newActiveNotes[0] = true;
          return newActiveNotes;
        });
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [isFlipped, law.notes]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleNote = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveNotes((prev) => {
      const newActiveNotes = [...prev];
      newActiveNotes[index] = !newActiveNotes[index];
      return newActiveNotes;
    });
  };

  return (
    <div className="training-card-container" onClick={handleFlip}>
      <div className={`training-card ${isFlipped ? "flipped" : ""}`}>
        <div className="training-card-front">
          <div className="training-card-category">
            {translatePhysicsCategory(law.category)}
          </div>
          <h2 className="training-card-title">{law.name.split('\\n').map((line, i) => (
            <>
              {i > 0 && <br />}
              {line}
            </>
          ))}</h2>
          <div className="flip-hint">
            <span>Нажмите, чтобы перевернуть...</span>
          </div>
        </div>

        <div className="training-card-back">
          <div className="back-content">
            <div className="training-card-category">
              {translatePhysicsCategory(law.category)}
            </div>
            <div className="category-badge">
              {translatePhysicsCategory(law.category)}
            </div>
            <h3 className="training-card-name">
              {law.name.split('\\n').map((line, i) => (
                <>{i > 0 && <br />}
                  {line}</>
                  
              ))}
            </h3>

            <div className="training-card-description">
              <RichTextRenderer html={law.description} />
              {law.notes && law.notes.length > 0 && (
                <div className="note-buttons-container">
                  {law.notes.map((note, index) => (
                    <div key={index} className="note-item">
                      <motion.button
                        className={`note-button ${
                          activeNotes[index] ? "active" : ""
                        }`}
                        onClick={(e) => toggleNote(e, index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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

                          <div className="noted-text-content">
                            <RichTextRenderer html={note.text} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {law.formula && (
              <div className="training-card-formula">
                <span>Формула:</span>
                <FormulaParser formula={law.formula} />
              </div>
            )}

            <div className="training-card-meta">
              {law.discoveredBy && (
                <p>Закон открыл: {law.discoveredBy || "Не указано"}</p>
              )}
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
