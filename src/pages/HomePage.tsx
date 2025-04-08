import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/Card";
import { AddLawForm } from "../modals/AddLawModal";
import { EditLawForm } from "../modals/EditLawFModal";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { ClassFilter } from "../components/ClassFilter";
import { useLaws } from "../data/Laws";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { Difficulty } from "../types/Difficulty";
import { FaFilter, FaPlus } from "react-icons/fa";
import { difficulties, schoolClasses } from "../constants";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { laws, loading, error, categories, deleteLaw, createLaw, updateLaw } =
    useLaws();
  const { isAuthenticated } = useAuth();
  const [filteredLaws, setFilteredLaws] = useState<PhysicsLaw[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PhysicsCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isAddLawFormVisible, setIsAddLawFormVisible] = useState(false);
  const [editingLaw, setEditingLaw] = useState<PhysicsLaw | null>(null);

  useEffect(() => {
    if (!loading && laws.length > 0) {
      setFilteredLaws(laws);
    }
  }, [loading, laws]);

  useEffect(() => {
    if (loading || laws.length === 0) {
      return;
    }

    let filtered = [...laws];

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

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (law) =>
          law.name.toLowerCase().includes(query) ||
          law.description.toLowerCase().includes(query) ||
          (law.discoveredBy && law.discoveredBy.toLowerCase().includes(query))
      );
    }

    setFilteredLaws(filtered);
  }, [
    selectedCategory,
    selectedDifficulty,
    selectedClass,
    searchQuery,
    laws,
    loading,
  ]);

  const handleCategorySelect = (category: PhysicsCategory | null) => {
    setSelectedCategory(category);
  };

  const handleDifficultySelect = (difficulty: Difficulty | null) => {
    setSelectedDifficulty(difficulty);
  };

  const handleClassSelect = (schoolClass: number | null) => {
    setSelectedClass(schoolClass);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleDeleteLaw = async (id: string) => {
    const result = await deleteLaw(id);
    if (result) {
      setDeleteStatus({
        success: true,
        message: "Закон успешно удален",
      });

      setFilteredLaws((prevFiltered) =>
        prevFiltered.filter((law) => law.id !== id)
      );

      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    } else {
      setDeleteStatus({
        success: false,
        message: "Ошибка при удалении закона",
      });

      setTimeout(() => {
        setDeleteStatus(null);
      }, 5000);
    }
  };

  const handleAddLaw = async (law: Omit<PhysicsLaw, "id">) => {
    const result = await createLaw(law);

    if (result.success) {
      setDeleteStatus({
        success: true,
        message: "Закон успешно создан",
      });

      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);

      return { success: true, law: result.law };
    } else {
      setDeleteStatus({
        success: false,
        message: "Ошибка при создании закона",
      });

      setTimeout(() => {
        setDeleteStatus(null);
      }, 5000);

      return { success: false, error: result.error };
    }
  };

  const handleEditLaw = (law: PhysicsLaw) => {
    setEditingLaw(law);
  };

  const handleUpdateLaw = async (id: string, law: Omit<PhysicsLaw, "id">) => {
    const result = await updateLaw(id, law);

    if (result.success) {
      setDeleteStatus({
        success: true,
        message: "Закон успешно обновлен",
      });

      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);

      return { success: true, law: result.law };
    } else {
      setDeleteStatus({
        success: false,
        message: "Ошибка при обновлении закона",
      });

      setTimeout(() => {
        setDeleteStatus(null);
      }, 5000);

      return { success: false, error: result.error };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
    <div className="home-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Карточки по физике</h1>
        <p>Вспомните всё, что проходили на уроках!</p>
      </motion.div>

      {deleteStatus && (
        <motion.div
          className={`notification ${
            deleteStatus.success ? "notification-success" : "notification-error"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {deleteStatus.message}
        </motion.div>
      )}

      {loading ? (
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Загрузка данных...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Произошла ошибка при загрузке данных</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="filter-section">
            <div className="search-filter-row">
              <SearchBar onSearch={handleSearch} />
              <motion.button
                className={`toggle-button ${filtersVisible ? "active" : ""}`}
                onClick={toggleFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
                aria-label={
                  filtersVisible ? "Скрыть фильтры" : "Показать фильтры"
                }
              >
                <FaFilter />
              </motion.button>

              {isAuthenticated && (
                <motion.button
                  className="toggle-button"
                  style={{ backgroundColor: "#00ff7b" }}
                  onClick={() => setIsAddLawFormVisible(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Добавить новый закон"
                >
                  <FaPlus />
                </motion.button>
              )}
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
          </div>

          <motion.div
            className="cards-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredLaws.length > 0 ? (
              filteredLaws.map((law) => (
                <Card
                  key={law.id}
                  law={law}
                  onDelete={isAuthenticated ? handleDeleteLaw : undefined}
                  onEdit={isAuthenticated ? handleEditLaw : undefined}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>По вашим критериям не найдено ни одной карточки!</h3>
                <p>Попробуйте изменить настройки поиска или фильтра</p>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {isAddLawFormVisible && (
              <AddLawForm
                onSubmit={handleAddLaw}
                onCancel={() => setIsAddLawFormVisible(false)}
              />
            )}

            {editingLaw && (
              <EditLawForm
                law={editingLaw}
                onSubmit={handleUpdateLaw}
                onCancel={() => setEditingLaw(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
