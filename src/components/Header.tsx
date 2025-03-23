import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaBrain, FaBars, FaTimes } from "react-icons/fa";
import { PhysGorLogo } from "./PhysGorLogo";
import ThemeToggle from "./ThemeToggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
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
        </motion.nav>
        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
