import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleLogoClick}>
          {/* <span className="navbar-logo">🌐</span> */}
          <span className="navbar-title">NetWise</span>
        </div>

        <div className="navbar-menu">
          <a href="#about" className="navbar-link">
            About
          </a>
          <a href="#features" className="navbar-link">
            Features
          </a>
          <a href="#contact" className="navbar-link">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
