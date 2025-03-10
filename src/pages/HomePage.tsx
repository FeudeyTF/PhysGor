import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/Card";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { ClassFilter, SchoolClass } from "../components/ClassFilter";
import { physicsLaws, categories } from "../data/Laws";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { Difficulty } from "../types/Difficulty";
import { FaFilter } from "react-icons/fa";

const difficulties: Difficulty[] = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.VeryHard];
const schoolClasses: SchoolClass[] = [7, 8, 9, 10, 11];

export function HomePage() {
  const [filteredLaws, setFilteredLaws] = useState<PhysicsLaw[]>(physicsLaws);
  const [selectedCategory, setSelectedCategory] =
    useState<PhysicsCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedClass, setSelectedClass] =
    useState<SchoolClass | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => { 
    let filtered = physicsLaws;

    if (selectedCategory) {
      filtered = filtered.filter((law) => law.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter((law) => law.difficulty === selectedDifficulty);
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
  }, [selectedCategory, selectedDifficulty, selectedClass, searchQuery]);

  const handleCategorySelect = (category: PhysicsCategory | null) => {
    setSelectedCategory(category);
  };

  const handleDifficultySelect = (difficulty: Difficulty | null) => {
    setSelectedDifficulty(difficulty);
  };

  const handleClassSelect = (schoolClass: SchoolClass | null) => {
    setSelectedClass(schoolClass);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
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
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3
      }
    }
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

      <div className="filter-section">
        <div className="search-filter-row">
          <SearchBar onSearch={handleSearch} />
          <motion.button 
            className={`filter-toggle-btn ${filtersVisible ? 'active' : ''}`}
            onClick={toggleFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
            aria-label={filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
          >
           <FaFilter />
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
      </div>

      <motion.div
        className="cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredLaws.length > 0 ? (
          filteredLaws.map((law) => <Card key={law.id} law={law} />)
        ) : (
          <div className="no-results">
            <h3>По вашим критериям не найдено ни одной карточки!</h3>
            <p>Попробуйте изменить настройки поиска или фильтра</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
