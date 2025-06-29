import React, { useState, useEffect } from "react";
import Quiz from "../components/Quiz";

// Category mapping from frontend IDs to backend IDs
const categoryMapping = {
  "info-data-literacy": "1.1",
  "communication-collaboration": "2.1",
  "digital-content-creation": "2.2",
  "safety-security": "2.5",
  "problem-solving": "2.6",
};

// Category data for name lookup
const categories = [
  {
    id: "info-data-literacy",
    name: "Information and Data Literacy",
    backendId: "1.1",
  },
  {
    id: "communication-collaboration",
    name: "Communication and Collaboration",
    backendId: "2.1",
  },
  {
    id: "digital-content-creation",
    name: "Digital Content Creation",
    backendId: "2.2",
  },
  {
    id: "safety-security",
    name: "Safety and Security",
    backendId: "2.5",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    backendId: "2.6",
  },
];

interface Question {
  id: string;
  statement: string;
  type: string;
  level: string;
}

interface CategoryInfo {
  id: string;
  title: string;
  description: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category from URL
  const categoryId = window.location.pathname.split("/").pop() || "";
  const category = categories.find((cat) => cat.id === categoryId);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!category) {
        setError("Category not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch category info and questions from backend
        const response = await fetch(
          `http://localhost:5000/api/categories/${category.backendId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategoryInfo(data.category);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

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

  if (error || !category || !categoryInfo) {
    return (
      <div className="quiz-app">
        <h1>{error || "Category not found"}</h1>
        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-app">
        <h1>No questions available for this category</h1>
        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <Quiz
      categoryId={categoryId}
      questions={questions}
      categoryName={categoryInfo.title}
    />
  );
};

export default QuizPage;
