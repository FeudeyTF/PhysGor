import { motion } from "framer-motion";

export type SchoolClass = 7 | 8 | 9 | 10 | 11;

interface ClassFilterProps {
  classes: SchoolClass[];
  selectedClass: SchoolClass | null;
  onSelectClass: (schoolClass: SchoolClass | null) => void;
}

export function ClassFilter({
  classes,
  selectedClass,
  onSelectClass,
}: ClassFilterProps) {
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
            className={`filter-option ${selectedClass === schoolClass ? "active" : ""}`}
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
