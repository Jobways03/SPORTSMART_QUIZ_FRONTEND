import { useState } from "react";
import { forgotPassword } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!email) return;
    await forgotPassword({ email });
    setMsg("If email exists, reset link sent");
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-subtitle">
          Enter your registered email to receive a reset link
        </p>

        <div className="fp-form">
          <input
            className="fp-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={submit} className="fp-button">
            Send Reset Link
          </button>

          {msg && <div className="fp-info">{msg}</div>}
        </div>

        <div className="fp-links">
          <button onClick={() => navigate("/login")} className="fp-link-btn">
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
