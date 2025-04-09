import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PhysicsLaw } from "../types/PhysicsLaw";
import { translatePhysicsCategory } from "../types/PhysicsCategory";
import { FormulaParser } from "./FormulaParser";

enum QuestionType {
  Formula,
  Definition,
  Author,
}

type MultipleChoiceCardProps = {
  law: PhysicsLaw;
  allLaws: PhysicsLaw[];
  onAnswer: (isCorrect: boolean) => void;
};

const types: QuestionType[] = [
  QuestionType.Formula,
  QuestionType.Definition,
  QuestionType.Author,
];

export function MultipleChoiceCard(props: MultipleChoiceCardProps) {
  const { law, allLaws, onAnswer } = props;
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.Formula
  );
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    const availableTypes = types.filter((type) => {
      if (type === QuestionType.Formula && !law.formula) {
        return false;
      }
      if (type === QuestionType.Author && !law.discoveredBy) {
        return false;
      }
      return true;
    });

    const randomType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];
    setQuestionType(randomType);

    let correctAnswer = "";
    let possibleOptions: string[] = [];

    switch (randomType) {
      case QuestionType.Formula:
        correctAnswer = law.formula || "";
        possibleOptions = allLaws
          .filter((l) => l.formula && l.id !== law.id)
          .map((l) => l.formula || "");
        break;
      case QuestionType.Definition:
        correctAnswer = law.description;
        possibleOptions = allLaws
          .filter((l) => l.id !== law.id)
          .map((l) => l.description);
        break;
      case QuestionType.Author:
        correctAnswer = law.discoveredBy || "";
        possibleOptions = allLaws
          .filter((l) => l.discoveredBy && l.id !== law.id)
          .map((l) => l.discoveredBy || "");
        break;
    }
    possibleOptions = Array.from(new Set(possibleOptions));

    const wrongOptions = possibleOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...wrongOptions, correctAnswer];
    setOptions(allOptions.sort(() => 0.5 - Math.random()));
  }, [allLaws, law]);

  const getQuestionText = () => {
    switch (questionType) {
      case QuestionType.Formula:
        return `Какая формула соответствует закону "${law.name}"?`;
      case QuestionType.Definition:
        return `Какое определение соответствует закону "${law.name}"?`;
      case QuestionType.Author:
        return `Кто открыл "${law.name}"?`;
      default:
        return "Выберите правильный ответ:";
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(option);

    let correct = false;
    switch (questionType) {
      case QuestionType.Formula:
        correct = option === law.formula;
        break;
      case QuestionType.Definition:
        correct = option === law.description;
        break;
      case QuestionType.Author:
        correct = option === law.discoveredBy;
        break;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    setTimeout(() => {
      onAnswer(correct);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }, 1500);
  };

  const getCorrectAnswer = () => {
    switch (questionType) {
      case QuestionType.Formula:
        return law.formula;
      case QuestionType.Definition:
        return law.description;
      case QuestionType.Author:
        return law.discoveredBy;
      default:
        return "";
    }
  };

  return (
    <div className="multiple-choice-card">
      <div className="question-container">
        <div className="category-badge">
          {translatePhysicsCategory(law.category)}
        </div>
        <h2 className="question-text">{getQuestionText()}</h2>
      </div>

      <div className="options-container">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`option-button ${
              selectedAnswer === option
                ? isCorrect
                  ? "correct"
                  : "incorrect"
                : ""
            } ${isAnswered && option === getCorrectAnswer() ? "correct" : ""}`}
            onClick={() => handleOptionSelect(option)}
            disabled={isAnswered}
          >
            {questionType === QuestionType.Formula ? (
              <FormulaParser formula={option} />
            ) : (
              option
            )}
          </motion.button>
        ))}
      </div>

      {isAnswered && (
        <div
          className={`feedback-message ${isCorrect ? "correct" : "incorrect"}`}
        >
          {isCorrect ? "Правильно!" : "Неправильно!"}
        </div>
      )}
    </div>
  );
}
