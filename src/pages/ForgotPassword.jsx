import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "If an account exists with that email, password reset instructions have been sent.");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Unable to process password reset request. Please try again later.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Hospital Management System</h2>
          <p>Reset your account password</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && (
          <div className="alert alert-success">
            {message}
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#155724" }}>
              💡 <em>Check your email inbox or backend console logs for the secure 15-minute reset link.</em>
            </div>
          </div>
        )}

        {!message ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", margin: 0 }}>
              Enter the email address associated with your hospital account. We will generate a secure reset link valid for 15 minutes.
            </p>

            <div className="form-group">
              <label htmlFor="email">Registered Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder="name@hospital.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending Instructions..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setMessage("");
                setEmail("");
              }}
              style={{ width: "100%", padding: "10px" }}
            >
              Request Another Link
            </button>
          </div>
        )}

        <div className="auth-footer" style={{ marginTop: "24px" }}>
          Remember your password? <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
