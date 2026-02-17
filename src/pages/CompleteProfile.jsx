import React, { useState } from "react";
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

  // If user already has phone or isn't logged in, redirect
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (user.phone) {
    navigate("/matches", { replace: true });
    return null;
  }

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
              <span className="mat-icon">phone_android</span>
            </div>

            <div className="titleWrap">
              <h1 className="title">Almost There!</h1>
              <p className="subtitle">
                Add your phone number to complete your profile
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="form" onSubmit={onSubmit}>
            <div className="fields">
              <div className="field">
                <label className="label" htmlFor="phone">
                  Phone Number
                </label>

                <div className="inputWrap">
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "rgba(148,163,184,0.7)",
                    }}
                  >
                    +91
                  </span>

                  <input
                    id="phone"
                    className="input"
                    style={{ paddingLeft: 48 }}
                    placeholder="Enter 10-digit phone number"
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
                "Continue"
              )}
            </button>
          </form>

          <div className="footer">
            <p className="footerText">
              Logged in as{" "}
              <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                {user.email}
              </span>
            </p>
          </div>
        </div>

        <div className="homeIndicator" aria-hidden="true" />
      </div>
    </div>
  );
}
