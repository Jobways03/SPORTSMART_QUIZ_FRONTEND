import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/auth.service";
import { getPasswordStrength } from "../utils/passwordStrength";
import "../styles/login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const isStrongPassword = (val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setMsg("");

    if (!token) return setError("Invalid or missing reset token");
    if (!password) return setError("Password is required");
    if (!isStrongPassword(password))
      return setError(
        "Password must include uppercase, lowercase, number & special character",
      );
    if (strength.level < 2) return setError("Password is too weak");

    try {
      setLoading(true);
      await resetPassword(token, { password });
      setMsg("Password updated successfully. Redirecting to login...");
      // small delay optional; if you prefer immediate redirect, remove setTimeout
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
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
              <span className="mat-icon">lock_reset</span>
            </div>

            <div className="titleWrap">
              <h1 className="title">Reset Password</h1>
              <p className="subtitle">
                Create a new password to access your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="form" onSubmit={submit}>
            <div className="fields">
              <div className="field">
                <label className="label" htmlFor="rp-password">
                  New Password
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    lock_outline
                  </span>

                  <input
                    id="rp-password"
                    className="input input--withRight"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* Strength indicator (same as Register) */}
                {password && (
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
            {msg && <div className="success">{msg}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  Updating...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            <p className="footerText">
              Back to
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
