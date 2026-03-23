import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function HomePage() {
  useEffect(() => { document.title = "Home | Sports Arena"; }, []);

  return (
    <div className="h-page">
      {/* Background */}
      <div className="h-bg-pattern" aria-hidden="true" />
      <div className="h-glow h-glow--tl" aria-hidden="true" />
      <div className="h-glow h-glow--br" aria-hidden="true" />

      {/* Top Nav */}
      <header className="h-nav">
        <div className="h-nav-left">
          <div className="h-brand">
            <div className="h-brand-mark" aria-hidden="true">
              SP
            </div>
            <div className="h-brand-text">
              <div className="h-brand-name">Sports Prediction</div>
              <div className="h-brand-tag">Predict • Score • Rank</div>
            </div>
          </div>
        </div>

        <div className="h-nav-right">
          <Link to="/login" className="h-nav-btn h-nav-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="h-nav-btn h-nav-btn--primary">
            Register
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="h-hero">
        <div className="h-shell">
          <div className="h-hero-grid">
            {/* Left */}
            <div className="h-hero-content">
              <div className="h-badge">Test Your Sports IQ</div>

              <h1 className="h-title">
                Predict Matches.
                <br />
                <span className="h-highlight">Win Exciting Prizes.</span>
              </h1>

              <p className="h-subtitle">
                Make predictions on upcoming sports matches, compete with other
                fans, and get rewarded for your accuracy.
              </p>

              <div className="h-cta">
                <Link to="/login" className="h-btn h-btn--primary">
                  Start Predicting Now
                </Link>

                <a href="#how-it-works" className="h-btn h-btn--ghost">
                  How It Works
                </a>
              </div>

              <div className="h-trust">
                <div className="h-trust-item">
                  <span className="h-dot" />
                  Fast signup
                </div>
                <div className="h-trust-item">
                  <span className="h-dot" />
                  Auto scoring
                </div>
                <div className="h-trust-item">
                  <span className="h-dot" />
                  Leaderboard
                </div>
              </div>
            </div>

            {/* Right Preview */}
            <div className="h-hero-visual">
              <div className="h-preview">
                <div className="h-preview-top">
                  <div className="h-pill">⚽ Football</div>
                  <div className="h-pill h-pill--muted">Starts in 2h</div>
                </div>

                <div className="h-preview-match">
                  <div className="h-team">Manchester City</div>
                  <div className="h-vs">vs</div>
                  <div className="h-team">Liverpool</div>
                </div>

                <div className="h-preview-qs">
                  <div className="h-q">Who will win?</div>
                  <div className="h-q">Total goals?</div>
                  <div className="h-q">First scorer?</div>
                </div>

                <div className="h-preview-foot">
                  <span className="h-note">Login to predict →</span>
                  <Link to="/login" className="h-mini-btn">
                    Open
                  </Link>
                </div>

                <div className="h-preview-glow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="h-section">
        <div className="h-shell">
          <div className="h-section-head">
            <h2 className="h-h2">How It Works</h2>
            <p className="h-sub">Simple steps to start predicting</p>
          </div>

          <div className="h-steps">
            <div className="h-step">
              <div className="h-step-no">1</div>
              <div className="h-step-title">Sign In</div>
              <div className="h-step-text">Create your account or login.</div>
            </div>

            <div className="h-step">
              <div className="h-step-no">2</div>
              <div className="h-step-title">Predict</div>
              <div className="h-step-text">
                Choose upcoming matches and answer questions.
              </div>
            </div>

            <div className="h-step">
              <div className="h-step-no">3</div>
              <div className="h-step-title">Win</div>
              <div className="h-step-text">
                Earn points for accuracy and climb the ranks.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="h-section">
        <div className="h-shell">
          <div className="h-section-head">
            <h2 className="h-h2">Why Choose Us</h2>
            <p className="h-sub">Designed for true sports fans</p>
          </div>

          <div className="h-features">
            <div className="h-card">
              <div className="h-icon">🏆</div>
              <div className="h-card-title">Win Prizes</div>
              <div className="h-card-text">
                Top predictors win exclusive rewards and recognition.
              </div>
            </div>

            <div className="h-card">
              <div className="h-icon">⚡</div>
              <div className="h-card-title">Real-time</div>
              <div className="h-card-text">
                Predict on live and upcoming matches across multiple sports.
              </div>
            </div>

            <div className="h-card">
              <div className="h-icon">📊</div>
              <div className="h-card-title">Track Progress</div>
              <div className="h-card-text">
                Detailed insights into your prediction performance.
              </div>
            </div>

            <div className="h-card">
              <div className="h-icon">🤝</div>
              <div className="h-card-title">Compete</div>
              <div className="h-card-text">
                Challenge friends and climb the prediction rankings.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="h-final">
        <div className="h-shell">
          <div className="h-final-card">
            <h2 className="h-final-title">
              Ready to Prove Your Sports Knowledge?
            </h2>
            <p className="h-final-sub">
              Join thousands of sports enthusiasts making predictions and
              winning prizes.
            </p>

            <Link to="/login" className="h-btn h-btn--primary h-btn--lg">
              Start Predicting Today
            </Link>

            <div className="h-final-note">
              New users get bonus points on their first prediction
            </div>
          </div>
        </div>
      </section>

      <footer className="h-footer">
        <div className="h-shell h-footer-inner">
          <div className="h-footer-left">
            © {new Date().getFullYear()} Sports Prediction
          </div>
          <div className="h-footer-right">
            <Link to="/login" className="h-footer-link">
              Login
            </Link>
            <Link to="/register" className="h-footer-link">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
