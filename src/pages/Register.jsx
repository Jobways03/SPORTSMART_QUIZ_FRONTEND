import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { getPasswordStrength } from "../utils/passwordStrength";
import "../styles/login.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validation
    if (!form.name.trim()) {
      return setError("Name is required");
    }

    if (!form.password) {
      return setError("Password is required");
    }

    if (strength.level < 2) {
      return setError("Password is too weak");
    }

    try {
      setLoading(true);
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to participate in live quizzes</p>

        <form className="login-form" onSubmit={submit}>
          <input
            className="form-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="form-input"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="form-input"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* PASSWORD FIELD */}
          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}
          {form.password && (
            <div className="password-strength">
              <div className={`strength-bar strength-${strength.level}`} />
              <span className={`strength-label strength-${strength.level}`}>
                {strength.label}
              </span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button className="login-button" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* ✅ ROUTE TO LOGIN */}
        <div className="auth-links">
          <button className="link-btn" onClick={() => navigate("/login")}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
