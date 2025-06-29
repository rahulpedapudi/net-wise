import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAuthClick = () => {
    navigate("/auth");
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

        <div className="navbar-auth">
          {user ? (
            <div className="user-info">
              <span className="username">Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleAuthClick} className="login-button">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
