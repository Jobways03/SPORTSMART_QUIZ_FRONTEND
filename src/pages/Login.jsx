import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/matches", { replace: true });
  }, [user, navigate]);

  useEffect(() => { document.title = "Sign In | Sports Arena"; }, []);

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
      <img src="/sportsicon.png/cricket.png"        alt="" className="bg-sport bg-sport--1"  aria-hidden="true" />
      <img src="/sportsicon.png/volleyball.png"    alt="" className="bg-sport bg-sport--2"  aria-hidden="true" />
      <img src="/sportsicon.png/FootBall.png"      alt="" className="bg-sport bg-sport--3"  aria-hidden="true" />
      <img src="/sportsicon.png/Baseball.png"      alt="" className="bg-sport bg-sport--4"  aria-hidden="true" />
      <img src="/sportsicon.png/Hockey.png"        alt="" className="bg-sport bg-sport--5"  aria-hidden="true" />
      <img src="/sportsicon.png/Badminton.png"     alt="" className="bg-sport bg-sport--6"  aria-hidden="true" />
      <img src="/sportsicon.png/running.png"       alt="" className="bg-sport bg-sport--7"  aria-hidden="true" />
      <img src="/sportsicon.png/cricket (1).png"   alt="" className="bg-sport bg-sport--8"  aria-hidden="true" />
      <img src="/sportsicon.png/cricket-ball.png"  alt="" className="bg-sport bg-sport--9"  aria-hidden="true" />
      <img src="/sportsicon.png/football1.png"     alt="" className="bg-sport bg-sport--10" aria-hidden="true" />
      <img src="/sportsicon.png/helmet.png"        alt="" className="bg-sport bg-sport--11" aria-hidden="true" />
      <img src="/sportsicon.png/pitch.png"         alt="" className="bg-sport bg-sport--12" aria-hidden="true" />
      <img src="/sportsicon.png/sports.png"        alt="" className="bg-sport bg-sport--13" aria-hidden="true" />
      <img src="/sportsicon.png/volleyball (1).png" alt="" className="bg-sport bg-sport--14" aria-hidden="true" />

      <div className="container">
        <div className="card">
          {/* Header */}
          <div className="header">
            <h1 className="title">Sportsmart Quiz</h1>
            <p className="subtitle">Elevate your sports knowledge.</p>
          </div>

          {/* Form */}
          <form className="form" onSubmit={onSubmit}>
            <div className="fields">
              {/* Identifier */}
              <div className="field">
                <label className="label" htmlFor="identifier">
                  EMAIL ADDRESS
                </label>

                <div className="inputWrap">
                  <span className="leftIcon mat-icon" aria-hidden="true">
                    mail_outline
                  </span>

                  <input
                    id="identifier"
                    className="input"
                    placeholder="curator@sportsquest.com"
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
                    PASSWORD
                  </label>

                  <button
                    type="button"
                    className="link"
                    onClick={() => navigate("/forgot-password")}
                    disabled={loading}
                  >
                    FORGOT?
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
                  Signing in...
                </span>
              ) : (
                <>SIGN IN &nbsp;&rarr;</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="dividerLine" />
            <span className="dividerText">or entry via</span>
            <span className="dividerLine" />
          </div>

          {/* Google Login */}
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
              New to the arena?
              <button
                type="button"
                className="footerLink"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Establish Profile
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
