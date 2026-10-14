import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./layout.css";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const currentRole = role || localStorage.getItem("userRole") || "patient";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">{currentRole} Navigation</div>
      <ul className="sidebar-menu">
        {currentRole === "patient" && (
          <>
            <li>
              <NavLink
                to="/patient/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient/book-appointment"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📅 Book Appointment
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📋 My Appointments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👤 Profile
              </NavLink>
            </li>
          </>
        )}

        {currentRole === "doctor" && (
          <>
            <li>
              <NavLink
                to="/doctor/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📅 Appointments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/patients"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👥 Patients
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/prescription"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📝 Prescription
              </NavLink>
            </li>
          </>
        )}

        {currentRole === "admin" && (
          <>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/doctors"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👨‍⚕️ Manage Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/patients"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👥 Manage Patients
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📅 Manage Appointments
              </NavLink>
            </li>
          </>
        )}

        <li>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            🚪 Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
