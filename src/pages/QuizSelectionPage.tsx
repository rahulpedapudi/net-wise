import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import { fuzzySearchWithScore } from "../utils/fuzzySearch";

// Main competency data
const competencies = [
  {
    id: "1",
    name: "Information and Data Literacy",
    description:
      "Test your skills in browsing, searching, filtering, evaluating, and managing digital information",
    icon: "🔍",
  },
  {
    id: "2",
    name: "Communication and Collaboration",
    description:
      "Assess your digital communication, sharing, citizenship, collaboration, and netiquette skills",
    icon: "💬",
  },
  {
    id: "3",
    name: "Digital Content Creation",
    description: "Rate your skills in creating and editing digital content",
    icon: "✍️",
  },
  {
    id: "4",
    name: "Safety and Security",
    description: "Test your knowledge of online safety and security practices",
    icon: "🛡️",
  },
  {
    id: "5",
    name: "Problem Solving",
    description:
      "Evaluate your ability to solve technical and digital challenges",
    icon: "🤖",
  },
];

const QuizSelectionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const searchResults = fuzzySearchWithScore(
    searchTerm,
    competencies,
    (competency) => `${competency.name} ${competency.description}`
  );

  const filteredCompetencies = searchResults.map((result) => result.item);

  const handleCompetencyClick = (competencyId: string) => {
    navigate(`/quiz/${competencyId}`);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="quiz-selection-page">
      <Navbar />

      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>Choose Your Assessment Area</h1>
          <p>Select a digital competency area to test your skills</p>
        </div>

        <SearchBar
          placeholder="Search competencies..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />

        <div className="categories-grid">
          {filteredCompetencies.map((competency) => (
            <div
              key={competency.id}
              className="category-card"
              onClick={() => handleCompetencyClick(competency.id)}>
              <div className="category-icon">{competency.icon}</div>
              <h3>{competency.name}</h3>
              <p>{competency.description}</p>
            </div>
          ))}
        </div>

        {filteredCompetencies.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No competencies found matching "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelectionPage;
