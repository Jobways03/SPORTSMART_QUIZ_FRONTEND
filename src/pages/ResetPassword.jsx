import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth.service";
import { getPasswordStrength } from "../utils/passwordStrength";
import "../styles/login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const submit = async () => {
    await resetPassword(token, { password });
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="auth-title">Reset Password</h2>

        <div className="login-form">
          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {password && (
            <div className="password-strength">
              <div className={`strength-bar strength-${strength.level}`} />
              <span className={`strength-label strength-${strength.level}`}>
                {strength.label}
              </span>
            </div>
          )}

          <button className="login-button" onClick={submit}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
