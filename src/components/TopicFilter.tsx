import { motion } from "framer-motion";

type TopicFilterProps = {
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
};

export function TopicFilter(props: TopicFilterProps) {
  const { topics, selectedTopic, onSelectTopic } = props;
  return (
    <div className="filter-container">
      <h3>Тема:</h3>
      <div className="filter-options">
        <motion.button
          className={`filter-option ${selectedTopic === null ? "active" : ""}`}
          onClick={() => onSelectTopic(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Все
        </motion.button>
        {topics.map((topic) => (
          <motion.button
            key={topic}
            className={`filter-option ${
              selectedTopic === topic ? "active" : ""
            }`}
            onClick={() => onSelectTopic(topic)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {topic}
          </motion.button>
        ))}
      </div>
    </div>
  );
}