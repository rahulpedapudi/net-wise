import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { fuzzySearchWithScore } from "../utils/fuzzySearch";

// Category data
const categories = [
  {
    id: "info-data-literacy",
    name: "Information and Data Literacy",
    description:
      "Evaluate your ability to find, evaluate, and use digital information",
    icon: "📊",
  },
  {
    id: "communication-collaboration",
    name: "Communication and Collaboration",
    description: "Assess your digital communication and teamwork skills",
    icon: "💬",
  },
  {
    id: "digital-content-creation",
    name: "Digital Content Creation",
    description: "Rate your skills in creating and editing digital content",
    icon: "✏️",
  },
  {
    id: "safety-security",
    name: "Safety and Security",
    description: "Test your knowledge of online safety and security practices",
    icon: "🔒",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    description:
      "Evaluate your ability to solve technical and digital challenges",
    icon: "🧩",
  },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const searchResults = fuzzySearchWithScore(
    searchTerm,
    categories,
    (category) => `${category.name} ${category.description}`
  );

  const filteredCategories = searchResults.map((result) => result.item);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/quiz/${categoryId}`);
  };

  return (
    <div className="home-page">
      <h1>Internet Native </h1>

      <SearchBar
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
      />

      <div className="categories-grid">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}>
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
