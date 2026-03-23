import React, { useEffect, useMemo, useState } from "react";
import { adminLogin } from "../../services/adminAuth.service";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAdminAuthed, login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanEmail = useMemo(() => email.trim(), [email]);

  useEffect(() => {
    const prev = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
      backgroundColor: document.body.style.backgroundColor,
    };
    document.body.style.backgroundImage = 'url("/background img.png")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "#d5dbd7";
    return () => {
      document.body.style.backgroundImage = prev.backgroundImage;
      document.body.style.backgroundSize = prev.backgroundSize;
      document.body.style.backgroundPosition = prev.backgroundPosition;
      document.body.style.backgroundAttachment = prev.backgroundAttachment;
      document.body.style.backgroundColor = prev.backgroundColor;
    };
  }, []);

  useEffect(() => {
    if (isAdminAuthed) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAdminAuthed, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!cleanEmail) return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");

    try {
      setLoading(true);
      const data = await adminLogin({
        email: cleanEmail,
        password,
      });

      if (!data?.token) {
        throw new Error("Token not received from server.");
      }

      login({ token: data.token, admin: data.admin });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Admin login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-auth-shell">
        {/* LEFT: info panel */}
        <div className="admin-auth-info">
          <div className="admin-brand">
            <div className="admin-brand-mark" aria-hidden="true">
              SP
            </div>
            <div>
              <div className="admin-brand-name">Sports Prediction</div>
              <span className="admin-brand-tag">
                Admin Console • Matches • Quizzes • Results
              </span>
            </div>
          </div>

          <h2 className="admin-info-title">
            Manage the platform with control.
          </h2>

          <p className="admin-info-subtitle">
            Login to create matches, publish quizzes, release results, and track
            leaderboard visibility.
          </p>

          <div className="admin-info-list">
            <div className="admin-info-item">
              <span className="admin-dot" />
              <div>
                <p className="admin-info-item-title">Match management</p>
                <p className="admin-info-item-desc">
                  Create, update and schedule upcoming matches.
                </p>
              </div>
            </div>

            <div className="admin-info-item">
              <span className="admin-dot" />
              <div>
                <p className="admin-info-item-title">Quiz publishing</p>
                <p className="admin-info-item-desc">
                  Lock submissions and publish quizzes at the right time.
                </p>
              </div>
            </div>

            <div className="admin-info-item">
              <span className="admin-dot" />
              <div>
                <p className="admin-info-item-title">Results & leaderboard</p>
                <p className="admin-info-item-desc">
                  Publish results and enable leaderboard visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="admin-note">
            Tip: Use a strong admin password and don’t share credentials.
          </div>
        </div>

        {/* RIGHT: login form */}
        <div className="admin-login-card">
          <div className="admin-login-head">
            <h1 className="admin-login-main-title">Admin Login</h1>
            <p className="admin-auth-subtitle">
              Access dashboard to manage matches, quizzes and results.
            </p>
          </div>

          <form onSubmit={onSubmit} className="admin-login-form">
            <label className="admin-form-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className="admin-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Admin Email"
              autoComplete="email"
              inputMode="email"
              disabled={loading}
            />

            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>

            <div className="admin-password-field">
              <input
                id="admin-password"
                className="admin-form-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <div className="admin-error-message">{error}</div>}

            <button className="admin-login-button" disabled={loading}>
              {loading ? (
                <span className="admin-btn-loading">
                  <span className="admin-spinner" aria-hidden="true" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="admin-auth-foot">
            By continuing, you agree to platform admin policies.
          </div>
        </div>
      </div>
    </div>
  );
}
