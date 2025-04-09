import { motion } from "framer-motion";
import { Difficulty } from "../types/Difficulty";

type DifficultyFilterProps = {
  difficulties: Difficulty[];
  selectedDifficulty: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty | null) => void;
};

export function DifficultyFilter({
  difficulties,
  selectedDifficulty,
  onSelectDifficulty,
}: DifficultyFilterProps) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.Easy:
        return " #4CAF50";
      case Difficulty.Medium:
        return " #FF9800";
      case Difficulty.Hard:
        return "#135deg";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <div className="filter-container">
      <h3>Сложность:</h3>
      <div className="filter-options">
        <motion.button
          className={`filter-option ${
            selectedDifficulty === null ? "active" : ""
          }`}
          onClick={() => onSelectDifficulty(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Все
        </motion.button>
        {difficulties.map((difficulty) => (
          <motion.button
            key={difficulty}
            className={`filter-option ${
              selectedDifficulty === difficulty ? "active" : ""
            }`}
            style={{
              background:
                selectedDifficulty === difficulty
                  ? getDifficultyColor(difficulty)
                  : undefined,
            }}
            onClick={() => onSelectDifficulty(difficulty)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {difficulty}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
