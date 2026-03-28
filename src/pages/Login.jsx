import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { phoneLogin, phoneRegister } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useUser();

  useEffect(() => {
    if (user) navigate("/matches", { replace: true });
  }, [user, navigate]);

  useEffect(() => { document.title = "Sign In | Sports Arena"; }, []);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onChangePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) setPhone(digits);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      if (isNewUser) {
        if (!name.trim() || name.trim().length < 2) {
          setError("Name must be at least 2 characters");
          return;
        }

        const data = await phoneRegister({ phone, name: name.trim() });
        login(data);
        navigate("/matches");
      } else {
        const data = await phoneLogin({ phone });

        if (data.isNewUser) {
          setIsNewUser(true);
        } else {
          login(data);
          navigate("/matches");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onPhoneBack = () => {
    setIsNewUser(false);
    setName("");
    setError("");
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
            <h1 className="title">Sportsmart Quiz</h1>
            <p className="subtitle">
              {isNewUser
                ? "Welcome! Tell us your name to get started."
                : "Enter your phone number to continue."}
            </p>
          </div>

          {/* Form */}
          <form className="form" onSubmit={onSubmit}>
            <div className="fields">
              {/* Phone */}
              <div className="field">
                <label className="label" htmlFor="phone">
                  PHONE NUMBER
                </label>

                <div className="inputWrap">
                  <span className="leftIcon" style={{ fontFamily: "Lexend, system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--muted)" }} aria-hidden="true">
                    +91
                  </span>

                  <input
                    id="phone"
                    className="input"
                    style={{ paddingLeft: 48 }}
                    placeholder="9876543210"
                    value={phone}
                    onChange={onChangePhone}
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    disabled={loading || isNewUser}
                  />
                </div>
              </div>

              {/* Name — only for new users */}
              {isNewUser && (
                <div className="field">
                  <label className="label" htmlFor="name">
                    YOUR NAME
                  </label>

                  <div className="inputWrap">
                    <span className="leftIcon mat-icon" aria-hidden="true">
                      person_outline
                    </span>

                    <input
                      id="name"
                      className="input"
                      placeholder="e.g. Virat Kohli"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && <div className="error">{error}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  {isNewUser ? "Creating account..." : "Checking..."}
                </span>
              ) : isNewUser ? (
                <>GET STARTED &nbsp;&rarr;</>
              ) : (
                <>CONTINUE &nbsp;&rarr;</>
              )}
            </button>
          </form>

          {/* Back link when in name step */}
          {isNewUser && (
            <div className="footer">
              <p className="footerText">
                Wrong number?
                <button
                  type="button"
                  className="footerLink"
                  onClick={onPhoneBack}
                  disabled={loading}
                >
                  Change Phone
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
