import React from "react";
import { useNavigate } from "react-router-dom";
import "./layout.css";

function Navbar({ role }) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userRole = role || localStorage.getItem("userRole") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🏥 Hospital Management System</h2>
      </div>
      <div className="navbar-user-section">
        <span className="user-badge">
          {userData.name ? `${userData.name} (${userRole})` : userRole}
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
