import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";

type MatchItem = {
  id: string;
  content: string;
  matched: boolean;
};

type MatchingCardProps = {
  laws: PhysicsLaw[];
  onComplete: (score: number) => void;
};

export function MatchingCard(props: MatchingCardProps) {
  const { laws, onComplete } = props;
  const [formulas, setFormulas] = useState<MatchItem[]>([]);
  const [names, setNames] = useState<MatchItem[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const lawsWithFormulas = laws.filter((law) => law.formula);
    const limitedLaws = lawsWithFormulas.slice(0, 4);

    const formulaItems = limitedLaws.map((law) => ({
      id: law.id || `formula_${Math.random().toString(36).substr(2, 9)}`,
      content: law.formula || "",
      matched: false,
    }));

    const nameItems = limitedLaws.map((law) => ({
      id: law.id || `name_${Math.random().toString(36).substr(2, 9)}`,
      content: law.name,
      matched: false,
    }));

    setFormulas(shuffle(formulaItems));
    setNames(shuffle(nameItems));
    setMatchedPairs(0);
  }, [laws]);

  const shuffle = <T extends unknown>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleFormulaClick = (id: string) => {
    if (selectedFormula === id) {
      setSelectedFormula(null);
      return;
    }
    setSelectedFormula(id);

    if (selectedName) {
      checkMatch(id, selectedName);
    }
  };

  const handleNameClick = (id: string) => {
    if (selectedName === id) {
      setSelectedName(null);
      return;
    }
    setSelectedName(id);

    if (selectedFormula) {
      checkMatch(selectedFormula, id);
    }
  };

  const checkMatch = (formulaId: string, nameId: string) => {
    if (formulaId === nameId) {
      setFormulas(
        formulas.map((f) => (f.id === formulaId ? { ...f, matched: true } : f))
      );

      setNames(
        names.map((n) => (n.id === nameId ? { ...n, matched: true } : n))
      );

      setMatchedPairs(matchedPairs + 1);
      setErrorMessage(null);

      setSelectedFormula(null);
      setSelectedName(null);

      if (matchedPairs + 1 >= names.length) {
        setTimeout(() => {
          onComplete(matchedPairs + 1);
        }, 1000);
      }
    } else {
      setErrorMessage("Неправильное соответствие!");

      setTimeout(() => {
        setSelectedFormula(null);
        setSelectedName(null);
        setErrorMessage(null);
      }, 1500);
    }
  };

  return (
    <div className="matching-card">
      <div className="matching-instructions">
        <h2>Сопоставьте формулы с названиями законов</h2>
        <p>Нажмите на формулу, затем на соответствующее название закона</p>
      </div>

      <div className="matching-container">
        <div className="matching-column">
          <h3>Формулы</h3>
          <div className="matching-items">
            {formulas.map((formula) => (
              <motion.button
                key={formula.id}
                className={`matching-item formula ${
                  formula.matched ? "matched" : ""
                } ${selectedFormula === formula.id ? "selected" : ""}`}
                onClick={() =>
                  !formula.matched && handleFormulaClick(formula.id)
                }
                disabled={formula.matched}
                whileHover={!formula.matched ? { scale: 1.05 } : {}}
                whileTap={!formula.matched ? { scale: 0.95 } : {}}
              >
                {formula.content}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="matching-column">
          <h3>Названия</h3>
          <div className="matching-items">
            {names.map((name) => (
              <motion.button
                key={name.id}
                className={`matching-item name ${
                  name.matched ? "matched" : ""
                } ${selectedName === name.id ? "selected" : ""}`}
                onClick={() => !name.matched && handleNameClick(name.id)}
                disabled={name.matched}
                whileHover={!name.matched ? { scale: 1.05 } : {}}
                whileTap={!name.matched ? { scale: 0.95 } : {}}
              >
                {name.content}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="matching-progress">
        Совпадений: {matchedPairs} из {names.length}
      </div>
    </div>
  );
}
