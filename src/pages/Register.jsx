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
    phone: "", // stores only 10 digits
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);

  const strength = getPasswordStrength(form.password);

  /* ---------------- VALIDATION HELPERS ---------------- */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // NAME
    if (!form.name.trim()) return setError("Name is required");
    if (form.name.trim().length < 2)
      return setError("Name must be at least 2 characters");
    if (!/^[a-zA-Z\s]+$/.test(form.name))
      return setError("Name can contain only letters");

    // EMAIL
    if (!form.email.trim()) return setError("Email is required");
    if (!isValidEmail(form.email)) return setError("Invalid email address");

    // PHONE
    if (!form.phone) return setError("Phone number is required");
    if (!isValidPhone(form.phone)) return setError("Invalid phone number");

    // PASSWORD
    if (!form.password) return setError("Password is required");
    if (!isStrongPassword(form.password))
      return setError(
        "Password must include uppercase, lowercase, number & special character",
      );
    if (strength.level < 2) return setError("Password is too weak");

    try {
      setLoading(true);
      await registerUser(form); // phone = 10 digits only
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again.",
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
          {/* NAME */}
          <input
            className="form-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* EMAIL */}
          <input
            className="form-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* PHONE */}
          <input
            className="form-input"
            placeholder="Phone"
            value={phoneFocused ? `+91 ${form.phone}` : ""}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => {
              if (!form.phone) setPhoneFocused(false);
            }}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const phone = digits.startsWith("91") ? digits.slice(2) : digits;

              if (phone.length <= 10) {
                setForm({ ...form, phone });
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.key === "Backspace" || e.key === "Delete") &&
                e.target.selectionStart <= 4
              ) {
                e.preventDefault();
              }
            }}
          />

          {/* PASSWORD */}
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

        <div className="auth-links">
          <button className="link-btn" onClick={() => navigate("/login")}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
