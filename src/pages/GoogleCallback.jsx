import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyGoogleToken } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import "../styles/login.css";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useUser();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("No token found. Please try logging in again.");
      return;
    }

    (async () => {
      try {
        const userData = await verifyGoogleToken(token);
        login(userData);

        // If phone is missing, redirect to complete profile
        if (!userData.phone) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/matches", { replace: true });
        }
      } catch {
        setError("Google login failed. Please try again.");
      }
    })();
  }, [searchParams, login, navigate]);

  return (
    <div className="sleek-login">
      <div className="bg-pattern" aria-hidden="true" />
      <div className="glow glow--tl" aria-hidden="true" />
      <div className="glow glow--br" aria-hidden="true" />

      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          {error ? (
            <>
              <div className="error" style={{ marginBottom: 16 }}>{error}</div>
              <button className="submit" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </>
          ) : (
            <>
              <div className="loadingRow" style={{ justifyContent: "center", marginBottom: 12 }}>
                <span className="spinner" aria-hidden="true" />
              </div>
              <p style={{ color: "rgba(148,163,184,0.78)", fontSize: 14 }}>
                Signing you in with Google...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
