import React, { useMemo, useState } from "react";
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

  const cleanIdentifier = useMemo(() => identifier.trim(), [identifier]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!cleanIdentifier || !password) {
      setError("Email/Phone and password are required");
      return;
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
        err?.response?.data?.message || "Invalid email/phone or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-shell">
        {/* LEFT: sports-themed info panel */}
        <div className="auth-info">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              SP
            </div>
            <div>
              <div className="brand-name">Sports Prediction</div>
              <span className="brand-tag">
                Pre-match predictions • Leaderboard • Results
              </span>
            </div>
          </div>

          <h2 className="info-title">
            Make predictions, earn points, and climb the leaderboard.
          </h2>

          <p className="info-subtitle">
            Login to submit predictions before match start. Once the match ends,
            your score updates automatically.
          </p>

          <div className="info-list">
            <div className="info-item">
              <span className="dot" />
              <div>
                <p className="info-item-title">Entry closes before kickoff</p>
                <p className="info-item-desc">
                  Predictions lock before match time to keep it fair.
                </p>
              </div>
            </div>

            <div className="info-item">
              <span className="dot" />
              <div>
                <p className="info-item-title">Auto scoring</p>
                <p className="info-item-desc">
                  Scores are calculated after results — no manual effort.
                </p>
              </div>
            </div>

            <div className="info-item">
              <span className="dot" />
              <div>
                <p className="info-item-title">Season leaderboard</p>
                <p className="info-item-desc">
                  Track your form across matches and improve your rank.
                </p>
              </div>
            </div>
          </div>

          <div className="note">
            Tip: Use your email or phone number to login. Keep your password
            secure.
          </div>
        </div>

        {/* RIGHT: login form */}
        <div className="login-card">
          <div className="login-head">
            <h1 className="login-main-title">Login</h1>
            <p className="auth-subtitle">
              Access your account to start playing.
            </p>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <label className="form-label" htmlFor="identifier">
              Email or Phone
            </label>
            <input
              id="identifier"
              className="form-input"
              placeholder="Email or Phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              inputMode="email"
              disabled={loading}
            />

            <label className="form-label" htmlFor="password">
              Password
            </label>

            <div className="password-field">
              <input
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="login-button" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" aria-hidden="true" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="auth-links">
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Don’t have an account? Register
            </button>

            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <div className="auth-foot">
            By continuing, you agree to fair play and platform rules.
          </div>
        </div>
      </div>
    </div>
  );
}
