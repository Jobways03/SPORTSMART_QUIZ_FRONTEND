import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchUserResults } from "../services/result.service";
import { useUser } from "../context/UserContext";
import "../styles/result.css";

export default function Results() {
  const { quizId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notParticipated, setNotParticipated] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    setNotParticipated(false);

    try {
      const res = await fetchUserResults({
        quizId,
        userId: user.userId,
      });

      setData(res);
    } catch (e) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message;

      // User did not participate
      if (
        status === 404 &&
        message === "You did not participate in this quiz"
      ) {
        setNotParticipated(true);
        return;
      }

      // Results not published
      if (e?.response?.data?.published === false) {
        setData({ published: false });
        return;
      }

      setError(message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line
  }, [quizId, user?.userId]);

  return (
    <div className="r-page">
      {/* Background */}
      <div className="r-bg-pattern" aria-hidden="true" />
      <div className="r-glow r-glow--tl" aria-hidden="true" />
      <div className="r-glow r-glow--br" aria-hidden="true" />

      <div className="r-shell">
        {/* Topbar */}
        <header className="r-topbar">
          <button
            type="button"
            className="r-back"
            onClick={() => navigate("/matches")}
            aria-label="Back to Matches"
            title="Back"
          >
            <span className="r-mi" aria-hidden="true">
              arrow_back
            </span>
            Back
          </button>

          <div className="r-topmeta">
            <div className="r-top-title">Quiz Results</div>
            <div className="r-top-sub">{loading ? "Loading…" : "Summary"}</div>
          </div>

          <button
            type="button"
            className="r-icon-btn"
            onClick={load}
            disabled={loading}
            aria-label="Refresh results"
            title="Refresh"
          >
            <span className="r-mi" aria-hidden="true">
              refresh
            </span>
          </button>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="r-alert r-alert--info">
            <div className="r-alert-title">Loading</div>
            <div className="r-alert-text">Loading results…</div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="r-alert r-alert--error">
            <div className="r-alert-title">Error</div>
            <div className="r-alert-text">{error}</div>
          </div>
        )}

        {/* USER DID NOT PARTICIPATE */}
        {!loading && notParticipated && (
          <div className="r-state">
            <div className="r-state-card">
              <div className="r-state-icon" aria-hidden="true">
                🚫
              </div>
              <h3 className="r-state-title">You did not participate</h3>
              <p className="r-state-text">
                Results are available only for users who submitted answers.
              </p>
            </div>
          </div>
        )}

        {/* RESULTS NOT PUBLISHED */}
        {!loading && data?.published === false && (
          <div className="r-state">
            <div className="r-state-card">
              <div className="r-state-icon" aria-hidden="true">
                ⏳
              </div>
              <h3 className="r-state-title">Results Not Published Yet</h3>
              <p className="r-state-text">
                Please check back once the admin publishes the results.
              </p>
            </div>
          </div>
        )}

        {/* RESULTS PUBLISHED */}
        {!loading && data?.published === true && (
          <>
            {/* SCORE */}
            <section className="r-score">
              <div className="r-score-card">
                <div className="r-score-left">
                  <div className="r-score-label">Your Score</div>
                  <div className="r-score-value">{data.score}</div>
                </div>

                <div className="r-score-right">
                  <div className="r-chip">
                    <span className="r-mi" aria-hidden="true">
                      done_all
                    </span>
                    Published
                  </div>
                </div>
              </div>
            </section>

            {/* BREAKDOWN HEADER */}
            <div className="r-section-head">
              <h3 className="r-section-title">Answer Breakdown</h3>
              <div className="r-section-sub">
                {data.breakdown?.length || 0} questions
              </div>
            </div>

            {/* BREAKDOWN CARDS */}
            <div className="r-grid">
              {data.breakdown.map((b, idx) => {
                const isCorrect = b.yourAnswer === b.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`r-card ${isCorrect ? "is-correct" : "is-wrong"}`}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    <div className="r-card-top">
                      <div className="r-qno">Q{idx + 1}</div>

                      <div className={`r-badge ${isCorrect ? "ok" : "bad"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </div>
                    </div>

                    <div className="r-qtext">{b.questionText}</div>

                    <div className="r-rows">
                      <div className="r-row">
                        <span className="r-k">Your Answer</span>
                        <b className={`r-v ${isCorrect ? "good" : "bad"}`}>
                          {b.yourAnswer}
                        </b>
                      </div>

                      {!isCorrect && (
                        <div className="r-row">
                          <span className="r-k">Correct Answer</span>
                          <b className="r-v good">{b.correctAnswer}</b>
                        </div>
                      )}

                      <div className="r-row r-row--points">
                        <span className="r-k">Points Earned</span>
                        <b className="r-v">{b.pointsEarned}</b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="r-footer">
              <Link to={`/leaderboard/${quizId}`} className="r-btn">
                <span className="r-btn-mi" aria-hidden="true">
                  leaderboard
                </span>
                View Leaderboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
