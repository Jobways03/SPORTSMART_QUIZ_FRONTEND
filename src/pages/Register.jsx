import React, { useMemo, useState } from "react";
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

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );

  /* ---------------- VALIDATION HELPERS ---------------- */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  /* ---------------- FIELD HELPERS ---------------- */
  const onChangeField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onChangePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    const phone = digits.startsWith("91") ? digits.slice(2) : digits;
    if (phone.length <= 10) setForm((prev) => ({ ...prev, phone }));
  };

  const phoneDisplayValue = phoneFocused
    ? `+91 ${form.phone}`
    : form.phone
      ? `+91 ${form.phone}`
      : "";

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

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
    <div className="sleek-login">
      <div className="bg-pattern" aria-hidden="true" />
      <div className="glow glow--tl" aria-hidden="true" />
      <div className="glow glow--br" aria-hidden="true" />

      <div className="container">
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="iconBox" aria-hidden="true">
              <span className="mat-icon">person_add</span>
            </div>

            <div className="titleWrap">
              <h1 className="title">Create Account</h1>
              <p className="subtitle">Register to continue</p>
            </div>
          </div>

          {/* Form */}
          <form className="form" onSubmit={submit}>
            <div className="fields">
              {/* Name */}
              <div className="field">
                <label className="label" htmlFor="name">
                  Full Name
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    person_outline
                  </span>

                  <input
                    id="name"
                    className="input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={onChangeField("name")}
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label className="label" htmlFor="email">
                  Email Address
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    mail_outline
                  </span>

                  <input
                    id="email"
                    className="input"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={onChangeField("email")}
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone (+91 lock) */}
              <div className="field">
                <label className="label" htmlFor="phone">
                  Phone Number
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    call
                  </span>

                  <input
                    id="phone"
                    className="input"
                    placeholder="Enter your phone"
                    value={phoneDisplayValue}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => {
                      if (!form.phone) setPhoneFocused(false);
                    }}
                    onChange={onChangePhone}
                    onKeyDown={(e) => {
                      // prevent deleting the "+91 " prefix area
                      if (
                        (e.key === "Backspace" || e.key === "Delete") &&
                        e.currentTarget.selectionStart <= 4
                      ) {
                        e.preventDefault();
                      }
                    }}
                    inputMode="numeric"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <div className="labelRow">
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="link"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    title="Already have an account?"
                  >
                    Login instead
                  </button>
                </div>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    lock_outline
                  </span>

                  <input
                    id="password"
                    className="input input--withRight"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChangeField("password")}
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="rightBtn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    disabled={loading}
                  >
                    <span className="mat-icon" aria-hidden="true">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>

                {/* Strength indicator */}
                {form.password && (
                  <div className="pwStrength">
                    <div className="pwTrack">
                      <div className={`pwFill pwFill--${strength.level}`} />
                    </div>
                    <span className={`pwLabel pwLabel--${strength.level}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            <p className="footerText">
              Already have an account?
              <button
                type="button"
                className="footerLink"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="homeIndicator" aria-hidden="true" />
      </div>
    </div>
  );
}
