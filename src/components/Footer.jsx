import React from "react";
import "./layout.css";

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {CURRENT_YEAR} Hospital Management System | Healthcare Platform
      </p>
    </footer>
  );
}

export default Footer;
