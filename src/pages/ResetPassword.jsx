import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./auth.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setTokenError("No reset token provided. Please request a new password reset link.");
      return;
    }

    const checkToken = async () => {
      try {
        const res = await api.get(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        if (res.data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(res.data.error || "This password reset link is invalid, expired, or has already been used.");
        }
      } catch {
        setTokenValid(false);
        setTokenError("Failed to verify reset token. Please request a new link.");
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess(res.data.message || "Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Hospital Management System</h2>
          <p>Set a New Password</p>
        </div>

        {verifying ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Verifying secure reset token...</p>
          </div>
        ) : !tokenValid ? (
          <div>
            <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
              {tokenError}
            </div>
            <Link to="/forgot-password" className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
              Request New Reset Link
            </Link>
            <div className="auth-footer">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        ) : (
          <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                Please create a new password of at least 6 characters.
              </p>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading || !!success}>
                {loading ? "Updating Password..." : "Reset Password"}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login">Cancel and Return to Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
