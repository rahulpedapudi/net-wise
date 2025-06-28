import React from "react";
import Quiz from "../components/Quiz";

// Quiz questions for each category
const quizData = {
  "info-data-literacy": [
    "How confident are you in evaluating the credibility of online information?",
    "How well can you identify reliable sources when researching online?",
    "How comfortable are you with analyzing data and statistics?",
    "How skilled are you at fact-checking information you find online?",
    "How well can you distinguish between facts and opinions in digital content?",
  ],
  "communication-collaboration": [
    "How effective are you at communicating through digital platforms?",
    "How comfortable are you collaborating with others using online tools?",
    "How well can you manage digital communication etiquette?",
    "How skilled are you at participating in online discussions?",
    "How effective are you at building relationships through digital channels?",
  ],
  "digital-content-creation": [
    "How confident are you in creating digital content (videos, graphics, etc.)?",
    "How well can you use digital tools for content creation?",
    "How comfortable are you with editing and formatting digital content?",
    "How skilled are you at creating engaging digital presentations?",
    "How well can you adapt content for different digital platforms?",
  ],
  "safety-security": [
    "How aware are you of online privacy and security best practices?",
    "How well can you protect your personal information online?",
    "How comfortable are you with managing passwords and account security?",
    "How skilled are you at identifying potential online threats?",
    "How well can you maintain digital security across different devices?",
  ],
  "problem-solving": [
    "How confident are you in solving technical problems independently?",
    "How well can you troubleshoot digital issues?",
    "How comfortable are you with learning new digital tools and technologies?",
    "How skilled are you at finding solutions to digital challenges?",
    "How well can you adapt to new digital environments and platforms?",
  ],
};

// Category data for name lookup
const categories = [
  {
    id: "info-data-literacy",
    name: "Information and Data Literacy",
  },
  {
    id: "communication-collaboration",
    name: "Communication and Collaboration",
  },
  {
    id: "digital-content-creation",
    name: "Digital Content Creation",
  },
  {
    id: "safety-security",
    name: "Safety and Security",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
  },
];

const QuizPage: React.FC = () => {
  // Get category from URL
  const categoryId = window.location.pathname.split("/").pop() || "";
  const questions = quizData[categoryId as keyof typeof quizData] || [];
  const category = categories.find((cat) => cat.id === categoryId);

  if (!category || questions.length === 0) {
    return (
      <div className="quiz-app">
        <h1>Category not found</h1>
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
      categoryName={category.name}
    />
  );
};

export default QuizPage;
