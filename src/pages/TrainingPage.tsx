import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainingCard } from "../components/TrainingCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { ClassFilter, SchoolClass } from "../components/ClassFilter";
import { physicsLaws, useLaws } from "../data/Laws";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { Difficulty } from "../types/Difficulty";

const difficulties: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
  Difficulty.VeryHard,
];
const schoolClasses: SchoolClass[] = [7, 8, 9, 10, 11];

export function TrainingPage() {
  const { categories } = useLaws();
  const [trainingLaws, setTrainingLaws] = useState<PhysicsLaw[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PhysicsCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsCompleted, setCardsCompleted] = useState(0);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    let filtered = [...physicsLaws];

    if (selectedCategory) {
      filtered = filtered.filter((law) => law.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(
        (law) => law.difficulty === selectedDifficulty
      );
    }

    if (selectedClass) {
      filtered = filtered.filter((law) => law.class === selectedClass);
    }

    setTrainingLaws(shuffle(filtered));
    setCurrentIndex(0);
    setCardsCompleted(0);
    setCorrectAnswers(0);
  }, [selectedCategory, selectedDifficulty, selectedClass]);

  const shuffle = (array: PhysicsLaw[]): PhysicsLaw[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCategorySelect = (category: PhysicsCategory | null) => {
    setSelectedCategory(category);
    setIsTrainingActive(false);
  };

  const handleDifficultySelect = (difficulty: Difficulty | null) => {
    setSelectedDifficulty(difficulty);
    setIsTrainingActive(false);
  };

  const handleClassSelect = (schoolClass: SchoolClass | null) => {
    setSelectedClass(schoolClass);
    setIsTrainingActive(false);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleNextCard = (isCorrect: boolean = true) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentIndex < trainingLaws.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setCardsCompleted(cardsCompleted + 1);
  };

  const startTraining = () => {
    setIsTrainingActive(true);
    setCurrentIndex(0);
    setCardsCompleted(0);
    setCorrectAnswers(0);
  };

  const resetTraining = () => {
    setIsTrainingActive(false);
    setCurrentIndex(0);
    setCardsCompleted(0);
    setCorrectAnswers(0);
  };

  const calculateProgress = () => {
    if (trainingLaws.length === 0) return 0;
    return Math.min(
      ((cardsCompleted % trainingLaws.length) / trainingLaws.length) * 100,
      100
    );
  };

  const filtersVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="training-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Тренировка</h1>
        <p>Проверь свои знания по физике с помощью нашего тренажёра!</p>
      </motion.div>

      {!isTrainingActive ? (
        <motion.div
          className="training-setup"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Начнём же тренировку!</h2>
          <p>
            Выберите категорию и начните проверять свои знания законов и
            определений физики.
          </p>

          <div className="filter-controls">
            <motion.button
              className={`toggle-button ${filtersVisible ? "active" : ""}`}
              onClick={toggleFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
            </motion.button>
          </div>

          <AnimatePresence>
            {filtersVisible && (
              <motion.div
                className="filters-column"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={filtersVariants}
              >
                <CategoryFilter
                  categories={categories as PhysicsCategory[]}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
                <DifficultyFilter
                  difficulties={difficulties}
                  selectedDifficulty={selectedDifficulty}
                  onSelectDifficulty={handleDifficultySelect}
                />
                <ClassFilter
                  classes={schoolClasses}
                  selectedClass={selectedClass}
                  onSelectClass={handleClassSelect}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="start-button"
            onClick={startTraining}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={trainingLaws.length === 0}
          >
            Начать тренировку
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="training-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-label">Карт просмотрено</div>
              <div className="stat-value">{cardsCompleted}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Правильно</div>
              <div className="stat-value">{correctAnswers}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Точность</div>
              <div className="stat-value">
                {cardsCompleted > 0
                  ? `${Math.round((correctAnswers / cardsCompleted) * 100)}%`
                  : "0%"}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="training-card-wrapper"
            >
              {trainingLaws.length > 0 && (
                <TrainingCard law={trainingLaws[currentIndex]} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="controls">
            <motion.button
              className="next-button"
              onClick={() => handleNextCard(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Знаю
            </motion.button>

            <motion.button
              className="next-button wrong-button"
              onClick={() => handleNextCard(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(135deg, #ff7170, #ff9b8c)",
              }}
            >
              Не знаю
            </motion.button>

            <motion.button
              className="reset-button"
              onClick={resetTraining}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать заново
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
