import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormulaParser } from "./FormulaParser";
import { useLaws } from "../data/Laws";

const fallbackFormulas = [
    "E=mc^2",
    "F=ma",
    "F=G\\frac{m_1m_2}{r^2}",
    "E=\\frac{1}{2}mv^2"
  ];

export function FloatingFormulas() {
  const { laws, loading } = useLaws();
  const [formulas, setFormulas] = useState<Array<{
    id: number;
    formula: string;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    function generateRandomFormulas() {
      const numberOfFormulas = Math.random() * 10 + 10;
      
      const newFormulas = [];
      
      const availableFormulas: string[] = [];
      
      if (laws && laws.length > 0) {
        laws.forEach(law => {
          if (law.formula && law.formula.trim() !== "") {
            availableFormulas.push(law.formula);
          }
        });
      }
      
      const formulasToUse = availableFormulas.length > 0 ? availableFormulas : fallbackFormulas;
      
      for (let i = 0; i < numberOfFormulas; i++) {
        const randomIndex = Math.floor(Math.random() * formulasToUse.length);
        newFormulas.push({
          id: i,
          formula: formulasToUse[randomIndex],
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: 0.8 + Math.random() * 1.8,
          opacity: 0.3 + Math.random() * 0.3,
          duration: 80 + Math.random() * 150,
          delay: Math.random() * -50
        });
      }
      
      setFormulas(newFormulas);
    };

    generateRandomFormulas();

    const interval = setInterval(() => {
      generateRandomFormulas();
    }, 120000); 

    return () => {
      clearInterval(interval);
    };
  }, [laws, loading]);

  return (
    <div className="floating-formulas-container">
      {formulas.map((item) => (
        <motion.div
          key={item.id}
          className="floating-formula"
          initial={{
            x: `${item.x}vw`,
            y: `${item.y}vh`,
            scale: item.scale,
            opacity: item.opacity
          }}
          animate={{
            x: [`${item.x}vw`, `${(item.x + 20) % 100}vw`, `${(item.x + 10) % 100}vw`, `${item.x}vw`],
            y: [`${item.y}vh`, `${(item.y + 15) % 100}vh`, `${(item.y + 25) % 100}vh`, `${item.y}vh`],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: item.delay
          }}
          style={{
            position: "absolute",
            scale: item.scale,
            opacity: item.opacity
          }}
        >
          <FormulaParser formula={item.formula} className="floating-formula-content" />
        </motion.div>
      ))}
    </div>
  );
}