import { useState } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { TranslatePhysicsCategory } from "../types/PhysicsCategory";

type FormulaWritingCardProps = {
  law: PhysicsLaw;
  onAnswer: (isCorrect: boolean) => void;
};

export function FormulaWritingCard(props: FormulaWritingCardProps) {
  const { law, onAnswer } = props;
  const [userInput, setUserInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const checkFormula = () => {
    if (!law.formula) return;

    const normalizedInput = userInput.replace(/\s+/g, "").toLowerCase();
    const normalizedFormula = law.formula.replace(/\s+/g, "").toLowerCase();

    const correct = normalizedInput === normalizedFormula;
    setIsCorrect(correct);
    setIsSubmitted(true);

    setTimeout(() => {
      onAnswer(correct);
      setUserInput("");
      setIsSubmitted(false);
      setShowHint(false);
    }, 2000);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const generateHint = () => {
    if (!law.formula) return "";
    const formula = law.formula;
    let hint = "";

    for (let i = 0; i < formula.length; i++) {
      if (
        i % 3 === 0 ||
        formula[i] === " " ||
        formula[i] === "=" ||
        formula[i] === "+" ||
        formula[i] === "-" ||
        formula[i] === "*" ||
        formula[i] === "/"
      ) {
        hint += formula[i];
      } else {
        hint += "•";
      }
    }

    return hint;
  };

  return (
    <div className="formula-writing-card">
      <div className="law-info">
        <div className="category-badge">{TranslatePhysicsCategory(law.category)}</div>
        <h2 className="law-name">{law.name}</h2>
        <p className="law-description">{law.description}</p>
      </div>

      <div className="formula-input-container">
        <label htmlFor="formula-input">Введите формулу:</label>
        <input
          id="formula-input"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className={`formula-input ${
            isSubmitted ? (isCorrect ? "correct" : "incorrect") : ""
          }`}
          placeholder="Например: F = ma"
          disabled={isSubmitted}
        />

        <div className="formula-buttons">
          <motion.button
            className="hint-button"
            onClick={toggleHint}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitted}
          >
            {showHint ? "Скрыть подсказку" : "Показать подсказку"}
          </motion.button>

          <motion.button
            className="check-button"
            onClick={checkFormula}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitted || !userInput.trim()}
          >
            Проверить
          </motion.button>
        </div>
      </div>

      {showHint && (
        <div className="formula-hint">
          <span>Подсказка:</span> {generateHint()}
        </div>
      )}

      {isSubmitted && (
        <div
          className={`feedback-message ${isCorrect ? "correct" : "incorrect"}`}
        >
          {isCorrect ? "Правильно!" : "Неправильно!"}
          <div className="correct-formula">
            Правильная формула: {law.formula}
          </div>
        </div>
      )}
    </div>
  );
}
