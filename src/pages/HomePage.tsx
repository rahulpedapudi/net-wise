import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import { fuzzySearchWithScore } from "../utils/fuzzySearch";

// Category data
const categories = [
  {
    id: "info-data-literacy",
    name: "Information and Data Literacy",
    description: "Rate your skills in creating and editing digital content",
    icon: "🔍",
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
    icon: "✍️",
  },
  {
    id: "safety-security",
    name: "Safety and Security",
    description: "Test your knowledge of online safety and security practices",
    icon: "🛡️",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    description:
      "Evaluate your ability to solve technical and digital challenges",
    icon: "🤖",
  },
];

// How it works steps
const howItWorksSteps = [
  {
    icon: "🧠",
    title: "Take the Quiz",
    description:
      "Test your skills across 5 real-world digital areas like searching, privacy, communication, and problem-solving.",
  },
  {
    icon: "📊",
    title: "Get Visual Feedback",
    description:
      "See what you know — and what you need to know — with category-wise scores.",
  },
  {
    icon: "📚",
    title: "Learn What Matters",
    description:
      "Get recommended learning paths and resources based on your performance.",
  },
  {
    icon: "🎓",
    title: "Earn Your Certificate",
    description:
      "Prove your digital fluency with a printable certificate you can share.",
  },
];

// Skill areas
const skillAreas = [
  { icon: "🔍", title: "Searching & Filtering Online" },
  { icon: "✅", title: "Evaluating Information" },
  { icon: "💬", title: "Digital Communication" },
  { icon: "🛡️", title: "Online Privacy" },
  { icon: "✍️", title: "Digital Content Creation" },
  { icon: "🖼️", title: "Copyright & Licensing" },
  { icon: "🤖", title: "Problem Solving with Tech" },
  { icon: "🌐", title: "Online Behavior & Netiquette" },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
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

  const handleStartAssessment = () => {
    setShowQuiz(true);
  };

  const handleHowItWorks = () => {
    // Scroll to how it works section
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (showQuiz) {
    return (
      <div className="home-page">
        <h1>Quiz Categories</h1>

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

        <button className="back-button" onClick={() => setShowQuiz(false)}>
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-headline">
            Close the Digital Divide.
            <br />
            Become Truly Digitally Native.
          </h1>
          <p className="hero-subheadline">
            Test your everyday digital skills — from searching smart to
            protecting your privacy. Get personalized feedback, learn what you
            don't know, and earn your Digital Fluency Certificate.
          </p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={handleStartAssessment}>
              Take the Free Assessment
            </button>
            <button className="cta-secondary" onClick={handleHowItWorks}>
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-statement">
        <div className="container">
          <h2>Why This Matters</h2>
          <p>
            Today's generation is device-literate, but not digitally fluent.
            They can scroll, tap, and click — but can they evaluate information?
            Search smart? Reuse content legally? We're here to bridge that gap
            and build real digital nativity — for students, professionals, and
            lifelong learners.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <h3>Step {index + 1}</h3>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Areas */}
      <section className="skill-areas">
        <div className="container">
          <h2>What You'll Be Tested On</h2>
          <div className="skills-grid">
            {skillAreas.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Test Your Digital Fluency?</h2>
          <p>
            It's free, takes under 5 minutes, and shows you exactly where you
            stand.
          </p>
          <button className="cta-primary" onClick={handleStartAssessment}>
            Start the Assessment →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              Made with 💻 for a digitally equal future.
            </div>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#github">GitHub</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
