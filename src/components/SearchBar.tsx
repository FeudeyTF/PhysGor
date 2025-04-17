import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  onSearch: (query: string) => void;
  small?: boolean;
};

export function SearchBar({ onSearch, small = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <motion.div
      className={`search-bar ${small ? 'search-bar-small' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Введите название закона..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">
          <FaSearch />
        </span>
      </div>
    </motion.div>
  );
}
