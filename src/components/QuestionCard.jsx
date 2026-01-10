import React from "react";
import "../styles/questioncard.css"

export default function QuestionCard({
  question,
  index,
  value,
  onChange,
  disabled,
}) {
  const getOptionLetter = (i) => {
    return String.fromCharCode(65 + i); // A, B, C, D, etc.
  };

  const getSportIcon = () => {
    const text = question.questionText.toLowerCase();
    if (
      text.includes("cricket") ||
      text.includes("bowl") ||
      text.includes("wicket")
    )
      return "🏏";
    if (
      text.includes("football") ||
      text.includes("soccer") ||
      text.includes("goal")
    )
      return "⚽";
    if (
      text.includes("basketball") ||
      text.includes("hoop") ||
      text.includes("dunk")
    )
      return "🏀";
    if (
      text.includes("tennis") ||
      text.includes("racket") ||
      text.includes("serve")
    )
      return "🎾";
    return "❓";
  };

  return (
    <div
      className="question-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="question-sport-icon">{getSportIcon()}</div>

      <div className="question-title">
        <span className="question-number">{index + 1}</span>
        <span className="question-text">{question.questionText}</span>
      </div>

      <div className="options-container">
        {question.options.map((opt, i) => {
          const isSelected = value === i;
          const optionClass = `option-item ${
            isSelected ? "option-selected" : ""
          } ${disabled ? "option-disabled" : ""}`;

          return (
            <label key={i} className={optionClass}>
              <div className="custom-radio">
                <input
                  type="radio"
                  name={`q_${question._id || question.id}`}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onChange(i)}
                />
                <div className="radio-circle"></div>
              </div>

              <div className="option-letter">{getOptionLetter(i)}</div>

              <div className="option-text">{opt}</div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

