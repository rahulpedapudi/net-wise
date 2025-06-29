import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  statement: string;
  type: string;
  level: string;
}

interface QuizProps {
  categoryId: string;
  questions: Question[];
  categoryName: string;
}

const Quiz: React.FC<QuizProps> = ({ categoryId, questions, categoryName }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Scale labels
  const scaleLabels = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "A little" },
    { value: 2, label: "Quite well" },
    { value: 3, label: "Fully confident" },
  ];

  // Initialize answers array when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && answers.length !== questions.length) {
      setAnswers(Array(questions.length).fill(0)); // Initialize with 0 instead of null
    }
  }, [questions, answers.length]);

  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // send data to backend
  // database name: netwise
  // collection name: netwise-db
  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(0));
    setCurrent(0);
    setSubmitted(false);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-app">
        <h1>No questions available</h1>
        <button onClick={handleBackToHome}>Back to Home</button>
      </div>
    );
  }

  const currentAnswer = answers[current] || 0;
  const currentQuestion = questions[current];

  return (
    <div className="quiz-app">
      <h1>{categoryName} Quiz</h1>
      {!submitted ? (
        <div className="question-block">
          <p>{currentQuestion.statement}</p>

          <div className="slider-container">
            <div className="slider-labels">
              {scaleLabels.map((scale) => (
                <div key={scale.value} className="scale-label">
                  <span className="scale-value">{scale.value}:</span>
                  <span className="scale-text">{scale.label}</span>
                </div>
              ))}
            </div>

            <div className="slider-wrapper">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={currentAnswer}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="slider"
                aria-label={`Rate your response from 0 (Not at all) to 3 (Fully confident)`}
              />
            </div>

            <div className="current-value">
              {scaleLabels[currentAnswer].label}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="nav-button prev">
              Previous
            </button>
            <span className="question-counter">
              Question {current + 1} of {questions.length}
            </span>
            {current < questions.length - 1 && (
              <button
                onClick={handleNext}
                className="nav-button next"
                title="Next">
                Next
              </button>
            )}
            {current === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                className="nav-button next"
                title="Submit">
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="results-block">
          <h2>Thank you for completing the {categoryName} quiz!</h2>
          <ul>
            {questions.map((question, idx) => (
              <li key={question.id}>
                {question.statement}{" "}
                <strong>{scaleLabels[answers[idx] || 0].label}</strong>
              </li>
            ))}
          </ul>
          <div className="result-buttons">
            <button onClick={handleRestart}>Restart Quiz</button>
            <button onClick={handleBackToHome}>Back to Categories</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
