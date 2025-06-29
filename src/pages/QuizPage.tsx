import React, { useState, useEffect } from "react";
import Quiz from "../components/Quiz";

// Main competency data for name lookup
const competencies = [
  {
    id: "1",
    name: "Information and Data Literacy",
  },
  {
    id: "2",
    name: "Communication and Collaboration",
  },
  {
    id: "3",
    name: "Digital Content Creation",
  },
  {
    id: "4",
    name: "Safety and Security",
  },
  {
    id: "5",
    name: "Problem Solving",
  },
];

interface Question {
  id: string;
  statement: string;
  type: string;
  level: string;
  sub_competency?: string;
  sub_competency_title?: string;
}

interface CompetencyInfo {
  id: string;
  name: string;
  sub_competencies: Record<string, any>;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [competencyInfo, setCompetencyInfo] = useState<CompetencyInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get competency from URL
  const competencyId = window.location.pathname.split("/").pop() || "";
  const competency = competencies.find((comp) => comp.id === competencyId);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!competency) {
        setError("Competency not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch main competency info and all questions from sub-competencies
        const response = await fetch(
          `http://localhost:5000/api/competencies/${competencyId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCompetencyInfo(data.competency);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [competency, competencyId]);

  if (loading) {
    return (
      <div className="quiz-app">
        <h1>Loading quiz...</h1>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}></div>
        </div>
      </div>
    );
  }

  if (error || !competency || !competencyInfo) {
    return (
      <div className="quiz-app">
        <h1>{error || "Competency not found"}</h1>
        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-app">
        <h1>No questions available for this competency</h1>
        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <Quiz
      competencyId={competencyId}
      questions={questions}
      competencyName={competencyInfo.name}
    />
  );
};

export default QuizPage;
