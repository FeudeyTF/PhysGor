import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();

    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      className={`physics-theme-toggle ${
        darkMode ? "dark-mode" : "light-mode"
      } ${isAnimating ? "animating" : ""}`}
      onClick={handleToggle}
      aria-label={
        darkMode
          ? "Switch to light mode (atom state)"
          : "Switch to dark mode (black hole state)"
      }
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="toggle-orbit">
        <div className="toggle-nucleus"></div>
        <div className="toggle-electron e1"></div>
        <div className="toggle-electron e2"></div>
        <div className="toggle-electron e3"></div>
        {darkMode && <div className="toggle-event-horizon"></div>}
        <div className="toggle-particles"></div>
      </div>
    </button>
  );
}

export default ThemeToggle;
