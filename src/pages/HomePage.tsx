import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/Card";
import { AddLawForm } from "../modals/AddLawModal";
import { EditLawForm } from "../modals/EditLawFModal";
import { FilterTooltip } from "../components/FilterTooltip";
import { Header } from "../components/Header";
import { useLaws } from "../data/Laws";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { Difficulty } from "../types/Difficulty";
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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterTooltipVisible, setIsFilterTooltipVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isAddLawFormVisible, setIsAddLawFormVisible] = useState(false);
  const [editingLaw, setEditingLaw] = useState<PhysicsLaw | null>(null);

  useEffect(() => {
    if (!loading && laws.length > 0) {
      setFilteredLaws(laws);

      const uniqueTopics = Array.from(
        new Set(laws.filter(law => law.topic).map(law => law.topic as string))
      );
      setTopics(uniqueTopics);

      const uniqueSubtopics = Array.from(
        new Set(laws.filter(law => law.subtopic).map(law => law.subtopic as string))
      );
      setSubtopics(uniqueSubtopics);
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

    if (selectedTopic) {
      filtered = filtered.filter((law) => law.topic === selectedTopic);
    }

    if (selectedSubtopic) {
      filtered = filtered.filter((law) => law.subtopic === selectedSubtopic);
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
    selectedTopic,
    selectedSubtopic,
    searchQuery,
    laws,
    loading,
  ]);

  const handleCategorySelect = (category: PhysicsCategory | null) => {
    setSelectedCategory(category);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleDifficultySelect = (difficulty: Difficulty | null) => {
    setSelectedDifficulty(difficulty);
  };

  const handleClassSelect = (schoolClass: number | null) => {
    setSelectedClass(schoolClass);
  };

  const handleTopicSelect = (topic: string | null) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
  };

  const handleSubtopicSelect = (subtopic: string | null) => {
    setSelectedSubtopic(subtopic);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFilterTooltip = () => {
    setIsFilterTooltipVisible(!isFilterTooltipVisible);
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

  return (
    <div className="home-page">
      <Header 
        onSearch={handleSearch}
        onFilterClick={toggleFilterTooltip}
        onAddClick={isAuthenticated ? () => setIsAddLawFormVisible(true) : undefined}
      />
      
      <div className="filter-tooltip-wrapper">
        <FilterTooltip
          isOpen={isFilterTooltipVisible}
          onClose={() => setIsFilterTooltipVisible(false)}
          categories={categories as PhysicsCategory[]}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          difficulties={difficulties}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={handleDifficultySelect}
          classes={schoolClasses}
          selectedClass={selectedClass}
          onSelectClass={handleClassSelect}
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={handleTopicSelect}
          subtopics={subtopics}
          selectedSubtopic={selectedSubtopic}
          onSelectSubtopic={handleSubtopicSelect}
        />
      </div>

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
