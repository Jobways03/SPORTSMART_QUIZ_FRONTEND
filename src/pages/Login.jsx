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
    <div className="sleek-login">
      <div className="bg-pattern" aria-hidden="true" />
      <div className="glow glow--tl" aria-hidden="true" />
      <div className="glow glow--br" aria-hidden="true" />

      <div className="container">
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="iconBox" aria-hidden="true">
              <span className="mat-icon">insights</span>
            </div>

            <div className="titleWrap">
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Enter your credentials to continue</p>
            </div>
          </div>

          {/* Form */}
          <form className="form" onSubmit={onSubmit}>
            <div className="fields">
              {/* Identifier */}
              <div className="field">
                <label className="label" htmlFor="identifier">
                  Email Address / Phone
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    mail_outline
                  </span>

                  <input
                    id="identifier"
                    className="input"
                    placeholder="Enter your email or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    inputMode="email"
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
                    onClick={() => navigate("/forgot-password")}
                    disabled={loading}
                  >
                    Forgot Password?
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            <p className="footerText">
              Don't have an account?
              <button
                type="button"
                className="footerLink"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* iOS indicator look (optional) */}
        <div className="homeIndicator" aria-hidden="true" />
      </div>
    </div>
  );
}
