import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryFilter } from "./CategoryFilter";
import { DifficultyFilter } from "./DifficultyFilter";
import { ClassFilter } from "./ClassFilter";
import { TopicFilter } from "./TopicFilter";
import { SubtopicFilter } from "./SubtopicFilter";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { Difficulty } from "../types/Difficulty";
import { FaTimes } from "react-icons/fa";

type FilterTooltipProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: PhysicsCategory[];
  selectedCategory: PhysicsCategory | null;
  onSelectCategory: (category: PhysicsCategory | null) => void;
  difficulties: Difficulty[];
  selectedDifficulty: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty | null) => void;
  classes: number[];
  selectedClass: number | null;
  onSelectClass: (schoolClass: number | null) => void;
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  subtopics: string[];
  selectedSubtopic: string | null;
  onSelectSubtopic: (subtopic: string | null) => void;
};

export function FilterTooltip({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  difficulties,
  selectedDifficulty,
  onSelectDifficulty,
  classes,
  selectedClass,
  onSelectClass,
  topics,
  selectedTopic,
  onSelectTopic,
  subtopics,
  selectedSubtopic,
  onSelectSubtopic
}: FilterTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="filter-tooltip-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="filter-tooltip" ref={tooltipRef}>
            <div className="tooltip-header">
              <h4>Фильтры</h4>
              <button className="close-button" onClick={onClose} aria-label="Закрыть">
                <FaTimes />
              </button>
            </div>
            <div className="tooltip-content">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
              />
              <DifficultyFilter
                difficulties={difficulties}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={onSelectDifficulty}
              />
              <ClassFilter
                classes={classes}
                selectedClass={selectedClass}
                onSelectClass={onSelectClass}
              />
              {topics.length > 0 && (
                <TopicFilter
                  topics={topics}
                  selectedTopic={selectedTopic}
                  onSelectTopic={onSelectTopic}
                />
              )}
              {subtopics.length > 0 && (
                <SubtopicFilter
                  subtopics={subtopics}
                  selectedSubtopic={selectedSubtopic}
                  onSelectSubtopic={onSelectSubtopic}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}