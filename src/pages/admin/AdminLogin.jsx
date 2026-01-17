import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isAdminAuthed) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAdminAuthed, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");

    try {
      setLoading(true);
      const data = await adminLogin({
        email: email.trim(),
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
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        <p className="admin-login-sub">
          Login to manage matches, quizzes and results.
        </p>

        <form onSubmit={onSubmit} className="admin-login-form">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Admin Email"
            autoComplete="email"
          />

          <label>Password</label>
          <div className="admin-password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              autoComplete="current-password"
            />
            <span
              className="admin-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
