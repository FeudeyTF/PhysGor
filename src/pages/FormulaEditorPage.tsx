import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { FormulaParser } from "../components/FormulaParser";
import { useLaws } from "../data/Laws";

export function FormulaEditorPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [showSymbolsReference, setShowSymbolsReference] =
    useState<boolean>(false);
  const { laws, loading, error } = useLaws();

  const examples = [
    "E = mc^2",
    "F = G(m_1\\cdotm_2/r^2)",
    "a = (\\Deltav/\\Deltat)",
    "v = v_0 + at",
    "F = ma",
    "\\DeltaE = h\\nu",
  ];

  const symbolReference = {
    greekLowercase: [
      { code: "\\alpha", description: "Альфа" },
      { code: "\\beta", description: "Бета" },
      { code: "\\gamma", description: "Гамма" },
      { code: "\\delta", description: "Дельта" },
      { code: "\\epsilon", description: "Эпсилон" },
      { code: "\\zeta", description: "Дзета" },
      { code: "\\eta", description: "Эта" },
      { code: "\\theta", description: "Тета" },
      { code: "\\iota", description: "Йота" },
      { code: "\\kappa", description: "Каппа" },
      { code: "\\lambda", description: "Лямбда" },
      { code: "\\mu", description: "Мю" },
      { code: "\\nu", description: "Ню" },
      { code: "\\xi", description: "Кси" },
      { code: "\\omicron", description: "Омикрон" },
      { code: "\\pi", description: "Пи" },
      { code: "\\rho", description: "Ро" },
      { code: "\\sigma", description: "Сигма" },
      { code: "\\tau", description: "Тау" },
      { code: "\\upsilon", description: "Ипсилон" },
      { code: "\\phi", description: "Фи" },
      { code: "\\chi", description: "Хи" },
      { code: "\\psi", description: "Пси" },
      { code: "\\omega", description: "Омега" },
    ],
    greekUppercase: [
      { code: "\\Alpha", description: "Альфа" },
      { code: "\\Beta", description: "Бета" },
      { code: "\\Gamma", description: "Гамма" },
      { code: "\\Delta", description: "Дельта" },
      { code: "\\Epsilon", description: "Эпсилон" },
      { code: "\\Zeta", description: "Дзета" },
      { code: "\\Eta", description: "Эта" },
      { code: "\\Theta", description: "Тета" },
      { code: "\\Iota", description: "Йота" },
      { code: "\\Kappa", description: "Каппа" },
      { code: "\\Lambda", description: "Лямбда" },
      { code: "\\Mu", description: "Мю" },
      { code: "\\Nu", description: "Ню" },
      { code: "\\Xi", description: "Кси" },
      { code: "\\Omicron", description: "Омикрон" },
      { code: "\\Pi", description: "Пи" },
      { code: "\\Rho", description: "Ро" },
      { code: "\\Sigma", description: "Сигма" },
      { code: "\\Tau", description: "Тау" },
      { code: "\\Upsilon", description: "Ипсилон" },
      { code: "\\Phi", description: "Фи" },
      { code: "\\Chi", description: "Хи" },
      { code: "\\Psi", description: "Пси" },
      { code: "\\Omega", description: "Омега" },
    ],
    mathSymbols: [
      { code: "\\infty", description: "Бесконечность" },
      { code: "\\approx", description: "Приблизительно равно" },
      { code: "\\neq", description: "Не равно" },
      { code: "\\leq", description: "Меньше или равно" },
      { code: "\\geq", description: "Больше или равно" },
      { code: "\\times", description: "Умножение" },
      { code: "\\div", description: "Деление" },
      { code: "\\pm", description: "Плюс-минус" },
      { code: "\\mp", description: "Минус-плюс" },
      { code: "\\partial", description: "Частная производная" },
      { code: "\\nabla", description: "Набла" },
      { code: "\\cdot", description: "Умножение (точка)" },
      { code: "\\int", description: "Интеграл" },
      { code: "\\sum", description: "Сумма" },
      { code: "\\prod", description: "Произведение" },
    ],
    formatting: [
      { code: "x^2", description: "Возведение в степень" },
      { code: "x_1", description: "Нижний индекс" },
      { code: "(a/b)", description: "Дробь" },
      { code: "\\sqrt{x}", description: "Квадратный корень" },
    ],
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  const handleFormulaClick = (formula: string) => {
    setInputValue(formula);
  };

  const handleSymbolClick = (code: string) => {
    setInputValue((prev) => prev + code);
  };

  const toggleSymbolsReference = () => {
    setShowSymbolsReference(!showSymbolsReference);
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
        <motion.button
          className="symbols-reference-button"
          onClick={toggleSymbolsReference}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showSymbolsReference
            ? "Скрыть полную справку по символам"
            : "Показать полную справку по символам"}
        </motion.button>
      </div>

      {showSymbolsReference && (
        <div className="symbols-reference">
          <h3>Полная справка по символам</h3>

          <div className="symbol-category">
            <h4>Строчные греческие буквы</h4>
            <div className="symbols-grid">
              {symbolReference.greekLowercase.map((item, index) => (
                <motion.div
                  key={index}
                  className="symbol-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSymbolClick(item.code)}
                >
                  <FormulaParser className="symbol" formula={item.code} />
                  <div className="symbol-code">{item.code}</div>
                  <div className="symbol-name">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="symbol-category">
            <h4>Заглавные греческие буквы</h4>
            <div className="symbols-grid">
              {symbolReference.greekUppercase.map((item, index) => (
                <motion.div
                  key={index}
                  className="symbol-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSymbolClick(item.code)}
                >
                  <FormulaParser className="symbol" formula={item.code} />
                  <div className="symbol-code">{item.code}</div>
                  <div className="symbol-name">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="symbol-category">
            <h4>Математические символы</h4>
            <div className="symbols-grid">
              {symbolReference.mathSymbols.map((item, index) => (
                <motion.div
                  key={index}
                  className="symbol-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSymbolClick(item.code)}
                >
                  <FormulaParser className="symbol" formula={item.code} />
                  <div className="symbol-code">{item.code}</div>
                  <div className="symbol-name">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="symbol-category">
            <h4>Форматирование формул</h4>
            <div className="symbols-grid">
              {symbolReference.formatting.map((item, index) => (
                <motion.div
                  key={index}
                  className="symbol-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSymbolClick(item.code)}
                >
                  <FormulaParser className="symbol" formula={item.code} />
                  <div className="symbol-code">{item.code}</div>
                  <div className="symbol-name">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      <div className="all-formulas-section">
        <h3>Все выражения из базы законов:</h3>
        {loading ? (
          <p>Загрузка формул...</p>
        ) : error ? (
          <p>Ошибка загрузки формул: {error}</p>
        ) : (
          <div className="formulas-grid">
            {laws
              .filter((law) => law.formula && law.formula.trim() !== "")
              .map((law, index) => (
                <motion.div
                  key={index}
                  className="formula-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFormulaClick(law.formula || "")}
                >
                  <div className="formula-name">{law.name}</div>
                  <div className="formula-raw">{law.formula}</div>
                  <div className="formula-rendered">
                    <FormulaParser formula={law.formula || ""} />
                  </div>
                </motion.div>
              ))}
          </div>
        )}
        {!loading &&
          !error &&
          laws.filter((law) => law.formula && law.formula.trim() !== "")
            .length === 0 && <p>Нет сохраненных формул в базе законов.</p>}
      </div>
    </div>
  );
}
