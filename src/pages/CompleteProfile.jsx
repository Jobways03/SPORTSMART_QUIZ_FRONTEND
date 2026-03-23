import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserPhone } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, login } = useUser();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Complete Profile | Sports Arena"; }, []);

  // Redirect if not logged in or already has phone
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.phone) {
      navigate("/matches", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const cleaned = phone.trim();

    if (!/^\d{10}$/.test(cleaned)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateUserPhone({
        userId: user.userId,
        phone: cleaned,
      });
      login(updatedUser);
      navigate("/matches", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update phone number"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.phone) return null;

  return (
    <div className="sleek-login">
      <div className="bg-pattern" aria-hidden="true" />
      <div className="glow glow--tl" aria-hidden="true" />
      <div className="glow glow--br" aria-hidden="true" />

      <div className="container">
        <div className="card">
          <div className="header">
            <p className="tagline">ONE MORE STEP</p>
            <h1 className="title">Add Your Phone</h1>
            <p className="subtitle">
              Complete your profile to start playing
            </p>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <div className="fields">
              <div className="field">
                <label className="label" htmlFor="phone">
                  PHONE NUMBER
                </label>

                <div className="inputWrap">
                  <span className="leftIcon" style={{
                    fontFamily: "Lexend, system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}>
                    +91
                  </span>

                  <input
                    id="phone"
                    className="input"
                    style={{ paddingLeft: 48 }}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setPhone(val);
                    }}
                    inputMode="numeric"
                    maxLength={10}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="loadingRow">
                  <span className="spinner" aria-hidden="true" />
                  Saving...
                </span>
              ) : (
                <>CONTINUE &nbsp;&rarr;</>
              )}
            </button>
          </form>

          <div className="footer">
            <p className="footerText">
              Logged in as <strong>{user?.email}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
