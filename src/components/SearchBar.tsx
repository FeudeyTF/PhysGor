import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export function SearchBar(props: SearchBarProps) {
  const { onSearch } = props;
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <motion.div
      className="search-bar"
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
      </div>
    </motion.div>
  );
}
