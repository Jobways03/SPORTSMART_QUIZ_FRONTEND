import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function HomePage() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Test Your Sports IQ</div>
            <h1 className="hero-title">
              Predict Matches.
              <br />
              <span className="highlight">Win Exciting Prizes.</span>
            </h1>
            <p className="hero-subtitle">
              Make predictions on upcoming sports matches, compete with other
              fans, and get rewarded for your accuracy.
            </p>

            <div className="hero-cta">
              <Link to="/login" className="cta-button primary">
                Start Predicting Now
              </Link>
              <a href="#how-it-works" className="cta-button secondary">
                How It Works
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="prediction-preview">
              <div className="preview-header">
                <div className="sport-badge">⚽ Football</div>
                <div className="time-badge">Starts in 2h</div>
              </div>
              <div className="match-teams">
                <div className="team">Manchester City</div>
                <div className="vs">vs</div>
                <div className="team">Liverpool</div>
              </div>
              <div className="preview-questions">
                <div className="question">Who will win?</div>
                <div className="question">Total goals?</div>
                <div className="question">First scorer?</div>
              </div>
              <div className="preview-footer">
                <span className="login-note">Login to predict →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="steps-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p className="section-subtitle">Simple steps to start predicting</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-circle">1</div>
            <h3>Sign In</h3>
            <p>Create your account or login to get started</p>
          </div>

          <div className="step-connector"></div>

          <div className="step">
            <div className="step-circle">2</div>
            <h3>Predict</h3>
            <p>Choose upcoming matches and make your predictions</p>
          </div>

          <div className="step-connector"></div>

          <div className="step">
            <div className="step-circle">3</div>
            <h3>Win</h3>
            <p>Earn points for accuracy and win exciting rewards</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p className="section-subtitle">Designed for true sports fans</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>Win Prizes</h3>
            <p>Top predictors win exclusive rewards and recognition</p>
          </div>

          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Real-time</h3>
            <p>Predict on live and upcoming matches across multiple sports</p>
          </div>

          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Detailed insights into your prediction performance</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🤝</div>
            <h3>Compete</h3>
            <p>Challenge friends and climb the prediction rankings</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-container">
          <h2>Ready to Prove Your Sports Knowledge?</h2>
          <p className="cta-subtitle">
            Join thousands of sports enthusiasts making predictions and winning
            prizes
          </p>
          <Link to="/login" className="cta-button primary large">
            Start Predicting Today
          </Link>
          <p className="cta-note">
            New users get bonus points on their first prediction
          </p>
        </div>
      </section>
    </div>
  );
}
