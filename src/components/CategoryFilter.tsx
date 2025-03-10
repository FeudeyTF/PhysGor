import { motion } from "framer-motion";
import { PhysicsCategory } from "../types/PhysicsCategory";

type CategoryFilterProps = {
  categories: PhysicsCategory[];
  selectedCategory: PhysicsCategory | null;
  onSelectCategory: (category: PhysicsCategory | null) => void;
};

export function CategoryFilter(props: CategoryFilterProps) {
  const { categories, selectedCategory, onSelectCategory } = props;
  return (
    <div className="category-filter">
      <h3>Фильтрация по категории</h3>
      <div className="filter-buttons">
        <motion.button
          className={`filter-button ${
            selectedCategory === null ? "active" : ""
          }`}
          onClick={() => onSelectCategory(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Все категории
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category}
            className={`filter-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onSelectCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
