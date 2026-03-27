import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { getPasswordStrength } from "../utils/passwordStrength";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) navigate("/matches", { replace: true });
  }, [user, navigate]);

  useEffect(() => { document.title = "Register | Sports Arena"; }, []);

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

 const pwLevel = Math.max(0, Math.min(3, Number(strength.level || 0)));
 const pwLabel = strength.label || "";


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
      <img src="/image/cricket.png"          alt="" className="bg-sport bg-sport--1"  aria-hidden="true" />
      <img src="/image/volleyball.png"       alt="" className="bg-sport bg-sport--2"  aria-hidden="true" />
      <img src="/image/football.png"         alt="" className="bg-sport bg-sport--3"  aria-hidden="true" />
      <img src="/image/baseball.png"         alt="" className="bg-sport bg-sport--4"  aria-hidden="true" />
      <img src="/image/american-football.png" alt="" className="bg-sport bg-sport--5"  aria-hidden="true" />
      <img src="/image/badminton.png"        alt="" className="bg-sport bg-sport--6"  aria-hidden="true" />
      <img src="/image/runner.png"           alt="" className="bg-sport bg-sport--7"  aria-hidden="true" />
      <img src="/image/cricket-batsman.png"  alt="" className="bg-sport bg-sport--8"  aria-hidden="true" />
      <img src="/image/tennis.png"           alt="" className="bg-sport bg-sport--9"  aria-hidden="true" />
      <img src="/image/football-kick.png"    alt="" className="bg-sport bg-sport--10" aria-hidden="true" />
      <img src="/image/baseball-batter.png"  alt="" className="bg-sport bg-sport--11" aria-hidden="true" />
      <img src="/image/badminton-smash.png"  alt="" className="bg-sport bg-sport--12" aria-hidden="true" />
      <img src="/image/tennis-ready.png"     alt="" className="bg-sport bg-sport--13" aria-hidden="true" />
      <img src="/image/table-tennis.png"     alt="" className="bg-sport bg-sport--14" aria-hidden="true" />

      <div className="container">
        <div className="card">
          {/* Header */}
          <div className="header">
            <h1 className="title">Establish Profile</h1>
            <p className="subtitle">Create your arena identity to get started.</p>
          </div>

          {/* Form */}
          <form className="form" onSubmit={submit}>
            <div className="fields">
              {/* Name */}
              <div className="field">
                <label className="label" htmlFor="name">
                  FULL NAME
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    person_outline
                  </span>

                  <input
                    id="name"
                    className="input"
                    placeholder="e.g. Virat Kohli"
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
                  EMAIL ADDRESS
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    mail_outline
                  </span>

                  <input
                    id="email"
                    className="input"
                    placeholder="curator@sportsquest.com"
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
                  PHONE NUMBER
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    call
                  </span>

                  <input
                    id="phone"
                    className="input"
                    placeholder="+91 9876543210"
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
                    PASSWORD
                  </label>
                </div>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    lock_outline
                  </span>

                  <input
                    id="password"
                    className="input input--withRight"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
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
                      <div className={`pwFill pwFill--${pwLevel}`} />
                    </div>
                    <span className={`pwLabel pwLabel--${pwLevel}`}>
                      {pwLabel}
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
                <>ESTABLISH PROFILE &nbsp;&rarr;</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="dividerLine" />
            <span className="dividerText">or entry via</span>
            <span className="dividerLine" />
          </div>

          {/* Google signup */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/auth/user/google`}
            className="googleBtn"
          >
            <svg className="googleIcon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </a>

          {/* Footer */}
          <div className="footer">
            <p className="footerText">
              Already in the arena?
              <button
                type="button"
                className="footerLink"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
