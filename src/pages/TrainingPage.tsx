import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainingCard } from "../components/TrainingCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { ClassFilter } from "../components/ClassFilter";
import { physicsLaws, useLaws } from "../data/Laws";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { Difficulty } from "../types/Difficulty";
import { TrainingMode, TrainingModeOption } from "../types/TrainingMode";
import { MultipleChoiceCard } from "../components/MultipleChoiceCard";
import { MatchingCard } from "../components/MatchingCard";
import { FormulaWritingCard } from "../components/FormulaWritingCard";
import { difficulties, schoolClasses } from "../constants";

const trainingModes: TrainingModeOption[] = [
  {
    id: TrainingMode.Flashcard,
    label: "Классика",
    description: "Проверьте свои знания с помощью карточек",
  },
  {
    id: TrainingMode.MultipleChoice,
    label: "Тест",
    description: "Выберите правильный ответ из предложенных вариантов",
  },
  {
    id: TrainingMode.Matching,
    label: "Соответствия",
    description: "Сопоставьте формулы с названиями законов",
  },
  {
    id: TrainingMode.FormulaWriting,
    label: "Запись формул",
    description: "Запишите формулу по памяти и проверьте её правильность",
  },
];

export function TrainingPage() {
  const { categories } = useLaws();
  const [trainingLaws, setTrainingLaws] = useState<PhysicsLaw[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PhysicsCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsCompleted, setCardsCompleted] = useState(0);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(
    TrainingMode.Flashcard
  );

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

    if (trainingMode === TrainingMode.FormulaWriting) {
      filtered = filtered.filter(
        (law) => law.formula && law.formula.trim() !== ""
      );
    }

    setTrainingLaws(shuffle(filtered));
    setCurrentIndex(0);
    setCardsCompleted(0);
    setCorrectAnswers(0);
  }, [selectedCategory, selectedDifficulty, selectedClass, trainingMode]);

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

  const handleClassSelect = (schoolClass: number | null) => {
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

  const handleModeSelect = (mode: TrainingMode) => {
    setTrainingMode(mode);
    setIsTrainingActive(false);
  };

  const renderTrainingContent = () => {
    if (trainingLaws.length === 0) {
      return (
        <div className="no-laws-message">
          Нет законов, соответствующих выбранным фильтрам
        </div>
      );
    }

    switch (trainingMode) {
      case TrainingMode.Flashcard:
        return <TrainingCard law={trainingLaws[currentIndex]} />;

      case TrainingMode.MultipleChoice:
        return (
          <MultipleChoiceCard
            law={trainingLaws[currentIndex]}
            allLaws={trainingLaws}
            onAnswer={(isCorrect: boolean) => handleNextCard(isCorrect)}
          />
        );

      case TrainingMode.Matching:
        return (
          <MatchingCard
            laws={
              trainingLaws.slice(currentIndex, currentIndex + 4).length < 4
                ? trainingLaws.slice(0, 4)
                : trainingLaws.slice(currentIndex, currentIndex + 4)
            }
            onComplete={(score) => {
              setCorrectAnswers(correctAnswers + score);
              setCardsCompleted(cardsCompleted + 4);
              setCurrentIndex((currentIndex + 4) % trainingLaws.length);
            }}
          />
        );

      case TrainingMode.FormulaWriting:
        return (
          <FormulaWritingCard
            law={trainingLaws[currentIndex]}
            onAnswer={(isCorrect: boolean) => handleNextCard(isCorrect)}
          />
        );

      default:
        return <TrainingCard law={trainingLaws[currentIndex]} />;
    }
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
            Выберите категорию и режим тренировки, затем начните проверять свои
            знания.
          </p>

          <div className="training-modes">
            <h3>Выберите режим тренировки</h3>
            <div className="mode-buttons">
              {trainingModes.map((mode) => (
                <motion.button
                  key={mode.id}
                  className={`mode-button ${
                    trainingMode === mode.id ? "active" : ""
                  }`}
                  onClick={() => handleModeSelect(mode.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mode-title">{mode.label}</div>
                  <div className="mode-description">{mode.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

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
              key={currentIndex + trainingMode}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="training-card-wrapper"
            >
              {renderTrainingContent()}
            </motion.div>
          </AnimatePresence>

          {trainingMode !== TrainingMode.Matching &&
            trainingMode !== TrainingMode.MultipleChoice && (
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
                    background: "#ff7170",
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
            )}

          {(trainingMode === TrainingMode.Matching ||
            trainingMode === TrainingMode.MultipleChoice) && (
            <div className="controls">
              <motion.button
                className="reset-button"
                onClick={resetTraining}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать заново
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
