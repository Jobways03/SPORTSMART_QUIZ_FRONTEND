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
    <div className="login-page">
      <div className="login-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your registered email to receive reset link
        </p>

        <div className="login-form">
          <input
            className="form-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={submit} className="login-button">
            Send Reset Link
          </button>

          {msg && <div className="info-message">{msg}</div>}
        </div>

        <div className="auth-links">
          <button onClick={() => navigate("/login")} className="link-btn">
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
