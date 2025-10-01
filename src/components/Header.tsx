import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaBrain,
  FaBars,
  FaTimes,
  FaLock,
  FaUnlock,
  FaSquareRootAlt,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { PhysGorLogo } from "./PhysGorLogo";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "../modals/AuthModal";

type HeaderProps = {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  onAddClick?: () => void;
};

export function Header({ onSearch, onFilterClick, onAddClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <PhysGorLogo />
          <div
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <motion.nav
            className={`nav-links ${mobileMenuOpen ? "open" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBook /> Карточки
            </Link>
            <Link
              to="/training"
              className={location.pathname === "/training" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBrain /> Тренировка
            </Link>
            {isAuthenticated && (
              <Link
                to="/formula-editor"
                className={
                  location.pathname === "/formula-editor" ? "active" : ""
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaSquareRootAlt /> Редактор формул
              </Link>
            )}
          </motion.nav>
        </div>

        <div className="header-right">
          <div className="header-search-controls">
            {onSearch && <SearchBar onSearch={onSearch} small />}

            {onFilterClick && (
              <motion.button
                className="icon-button filter-button"
                onClick={onFilterClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Фильтры"
                aria-label="Фильтры"
              >
                <FaFilter />
              </motion.button>
            )}

            {isAuthenticated && onAddClick && (
              <motion.button
                className="icon-button add-button"
                onClick={onAddClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Добавить новый закон"
                aria-label="Добавить новый закон"
              >
                <FaPlus />
              </motion.button>
            )}
          </div>

          {isAuthenticated ? (
            <motion.button
              className="auth-button logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Выйти из системы"
            >
              <FaUnlock />
              <span className="auth-text">Выйти</span>
            </motion.button>
          ) : (
            <motion.button
              className="auth-button login"
              onClick={() => setIsAuthModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Войти для редактирования"
            >
              <FaLock />
              <span className="auth-text">Войти</span>
            </motion.button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
