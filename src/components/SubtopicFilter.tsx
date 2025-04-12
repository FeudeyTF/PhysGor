import { motion } from "framer-motion";

type SubtopicFilterProps = {
  subtopics: string[];
  selectedSubtopic: string | null;
  onSelectSubtopic: (subtopic: string | null) => void;
};

export function SubtopicFilter(props: SubtopicFilterProps) {
  const { subtopics, selectedSubtopic, onSelectSubtopic } = props;
  return (
    <div className="filter-container">
      <h3>Подтема:</h3>
      <div className="filter-options">
        <motion.button
          className={`filter-option ${selectedSubtopic === null ? "active" : ""}`}
          onClick={() => onSelectSubtopic(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Все
        </motion.button>
        {subtopics.map((subtopic) => (
          <motion.button
            key={subtopic}
            className={`filter-option ${
              selectedSubtopic === subtopic ? "active" : ""
            }`}
            onClick={() => onSelectSubtopic(subtopic)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {subtopic}
          </motion.button>
        ))}
      </div>
    </div>
  );
}