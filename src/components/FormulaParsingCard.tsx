import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { FormulaParser } from "./FormulaParser";
import "../styles/components/FormulaParsingCard.scss";

export function FormulaParsingCard() {
  const [inputValue, setInputValue] = useState<string>("");

  const examples = [
    "E = mc^2",
    "F = G(m_1\\cdotm_2/r^2)",
    "a = (\\Delta v/\\Delta t)",
    "v = v_0 + at",
    "F = ma",
    "\\Delta E = h\\nu",
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  return (
    <div className="formula-parsing-card">
      <h2>Редактор Формул</h2>
      <p className="instructions">
        Введите математическую формулу, используя специальные обозначения:
      </p>

      <div className="syntax-guide">
        <h3>Руководство по синтаксису:</h3>
        <ul>
          <li>
            <code>^n</code> - для возведения в степень (например,{" "}
            <code>x^2</code> → x²)
          </li>
          <li>
            <code>_n</code> - для индексов (например, <code>v_1</code> → v₁)
          </li>
          <li>
            <code>(a/b)</code> - для дробей
          </li>
          <li>
            <code>\alpha, \beta, \gamma, ...</code> - для греческих букв
          </li>
          <li>
            <code>\times, \div, \pm, ...</code> - для математических символов
          </li>
        </ul>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Введите формулу (например: F = ma)"
          className="formula-input"
        />
      </div>

      <div className="preview-section">
        <h3>Предпросмотр:</h3>
        <div className="formula-preview">
          {inputValue ? (
            <FormulaParser formula={inputValue} />
          ) : (
            <span className="empty-preview">
              Формула будет отображаться здесь...
            </span>
          )}
        </div>
      </div>

      <div className="examples-section">
        <h3>Примеры формул:</h3>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              className="example-item"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExampleClick(example)}
            >
              <div className="example-raw">{example}</div>
              <div className="example-rendered">
                <FormulaParser formula={example} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
