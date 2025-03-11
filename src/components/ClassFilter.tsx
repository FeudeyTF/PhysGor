import { motion } from "framer-motion";

type ClassFilterProps = {
  classes: number[];
  selectedClass: number | null;
  onSelectClass: (schoolClass: number | null) => void;
};

export function ClassFilter(props: ClassFilterProps) {
  const { classes, selectedClass, onSelectClass } = props;
  return (
    <div className="filter-container">
      <h3>Класс:</h3>
      <div className="filter-options">
        <motion.button
          className={`filter-option ${selectedClass === null ? "active" : ""}`}
          onClick={() => onSelectClass(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Все
        </motion.button>
        {classes.map((schoolClass) => (
          <motion.button
            key={schoolClass}
            className={`filter-option ${
              selectedClass === schoolClass ? "active" : ""
            }`}
            onClick={() => onSelectClass(schoolClass)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {schoolClass} класс
          </motion.button>
        ))}
      </div>
    </div>
  );
}
