import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier || !password) {
      return setError("Email/Phone and password are required");
    }

    try {
      setLoading(true);
      const data = await userLogin({
        identifier: cleanIdentifier,
        password,
      });

      login(data);
      navigate("/matches");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email/phone or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-main-title">Live Sports Quiz</h1>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="form-label">Email or Phone</label>
          <input
            className="form-input"
            placeholder="Email or Phone number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />

          <label className="form-label">Password</label>

          {/* PASSWORD FIELD */}
          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* AUTH LINKS */}
        <div className="auth-links">
          <button className="link-btn" onClick={() => navigate("/register")}>
            Dont have an account ? Register
          </button>
          
          
            <button
              className="link-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
         
        </div>
      </div>
    </div>
  );
}
