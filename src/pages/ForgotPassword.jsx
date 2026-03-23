import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/auth.service";
import "../styles/login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  useEffect(() => { document.title = "Forgot Password | Sports Arena"; }, []);

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setMsg("");

    if (!email.trim()) return setError("Email is required");
    if (!isValidEmail(email.trim())) return setError("Invalid email address");

    try {
      setLoading(true);
      await forgotPassword({ email: email.trim() });
      setMsg("If email exists, reset link sent");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset link");
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
            <p className="tagline">ACCOUNT RECOVERY</p>
            <h1 className="title">Forgot Password</h1>
            <p className="subtitle">
              Enter your registered email to receive a reset link
            </p>
          </div>

          {/* Form */}
          <form className="form" onSubmit={submit}>
            <div className="fields">
              <div className="field">
                <label className="label" htmlFor="fp-email">
                  Email Address
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    mail_outline
                  </span>

                  <input
                    id="fp-email"
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && <div className="error">{error}</div>}
            {msg && <div className="success">{msg}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            <p className="footerText">
              Remembered your password?
              <button
                type="button"
                className="footerLink"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>

        <div className="homeIndicator" aria-hidden="true" />
      </div>
    </div>
  );
}
