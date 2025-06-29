import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  statement: string;
  type: string;
  level: string;
  sub_competency?: string;
  sub_competency_title?: string;
}

interface LearningResource {
  title: string;
  description: string;
  url: string;
  source: string;
}

interface SubCompetencyData {
  total_score: number;
  question_count: number;
  average_competence: number;
  title: string;
  learning_resources: {
    title: string;
    resources: LearningResource[];
  };
}

interface QuizProps {
  competencyId: string;
  questions: Question[];
  competencyName: string;
}

const Quiz: React.FC<QuizProps> = ({
  competencyId,
  questions,
  competencyName,
}) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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
      setAnswers(Array(questions.length).fill(0));
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          answers: answers,
          questions: questions,
          competency_id: competencyId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setSubmitted(true);
      } else {
        console.error("Failed to submit results");
      }
    } catch (error) {
      console.error("Error submitting results:", error);
    } finally {
      setLoading(false);
    }
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
    setResults(null);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const openResource = (url: string) => {
    window.open(url, "_blank");
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
      <h1>{competencyName} Assessment</h1>
      {!submitted ? (
        <div className="question-block">
          <div className="question-header">
            <p className="question-text">{currentQuestion.statement}</p>
            {currentQuestion.sub_competency_title && (
              <div className="sub-competency-badge">
                {currentQuestion.sub_competency_title}
              </div>
            )}
          </div>

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
                disabled={loading}
                className="nav-button next"
                title="Submit">
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="results-block">
          <h2>Your {competencyName} Competence Assessment</h2>

          {results && (
            <div className="results-summary">
              <div className="overall-competence">
                <h3>Overall Competence Level</h3>
                <div className="competence-display">
                  <span className="competence-value">
                    {results.overall_competence.percentage}%
                  </span>
                  <span className="competence-detail">
                    {results.overall_competence.total} out of{" "}
                    {results.overall_competence.max_possible} points
                  </span>
                </div>
              </div>

              <div className="sub-competency-competences">
                <h3>Sub-Competency Breakdown</h3>
                {Object.entries(results.sub_competency_competences).map(
                  ([subComp, data]: [string, any], index) => (
                    <div
                      key={subComp}
                      className={`sub-competency-competence ${
                        index ===
                        Object.keys(results.sub_competency_competences).length -
                          1
                          ? "least-confident"
                          : ""
                      }`}>
                      <div className="sub-comp-header">
                        <h4>{data.title}</h4>
                        <span className="sub-comp-competence">
                          {data.average_competence}/3
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(data.average_competence / 3) * 100}%`,
                          }}></div>
                      </div>
                      <p className="sub-comp-detail">
                        {data.question_count} questions • Average competence:{" "}
                        {data.average_competence}/3
                      </p>

                      {/* Learning Resources */}
                      {data.learning_resources &&
                        data.learning_resources.resources &&
                        data.learning_resources.resources.length > 0 && (
                          <div className="learning-resources">
                            <h5>
                              💡 Learning Resources to Improve Your Competence:
                            </h5>
                            {data.learning_resources.resources.map(
                              (resource: any, resIndex: number) => (
                                <div key={resIndex} className="resource-card">
                                  <div className="resource-info">
                                    <h6>{resource.title}</h6>
                                    <p>{resource.description}</p>
                                    <span className="resource-source">
                                      Source: {resource.source}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => openResource(resource.url)}
                                    className="resource-link"
                                    title="Opens in new tab">
                                    Open Resource →
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )
                )}
              </div>

              {/* Special attention for least confident sub-competency */}
              {results.least_confident_sub_competency && (
                <div className="least-confident-highlight">
                  <h3>🎯 Focus Area: Your Least Confident Sub-Competency</h3>
                  <p>
                    Based on your assessment,{" "}
                    <strong>
                      {results.least_confident_sub_competency[1].title}
                    </strong>
                    is where you could benefit most from additional learning.
                    Check out the resources above to build your confidence in
                    this area.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="result-buttons">
            <button onClick={handleRestart}>Take Assessment Again</button>
            <button onClick={handleBackToHome}>Back to Competencies</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
