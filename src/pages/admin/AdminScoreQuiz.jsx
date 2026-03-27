import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminFetchQuizzesByMatch } from "../../services/adminQuiz.service";
import { adminScoreQuiz } from "../../services/adminScore.service";
import "../../styles/admin-score-quiz.css";

export default function AdminScoreQuiz() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [match, setMatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const data = await adminFetchMatches();
      const list = Array.isArray(data) ? data : data?.matches || [];
      const found = list.find((m) => (m._id || m.id) === matchId);

      setMatch(found || null);

      const quizzes = await adminFetchQuizzesByMatch(matchId);
      const quizList = Array.isArray(quizzes) ? quizzes : [];
      const foundQuiz = quizList[0];
      setQuizId(foundQuiz ? (foundQuiz._id || foundQuiz.id) : null);
    } catch {
      setErrorMsg("Failed to load match information");
    } finally {
      setLoading(false);
    }
  };

  const handleScore = async () => {
    setErrorMsg("");
    setResult(null);

    if (!quizId) return setErrorMsg("Quiz not found for this match.");
    if (match?.status !== "COMPLETED") {
      return setErrorMsg("Match must be COMPLETED before scoring.");
    }

    try {
      setScoring(true);
      const res = await adminScoreQuiz(quizId);
      setResult(res);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Scoring failed.");
    } finally {
      setScoring(false);
    }
  };

  const status = match?.status || "UNKNOWN";
  const canScore = quizId && status === "COMPLETED" && !scoring;

  return (
    <div className="asq-page">
      <div className="asq-container">
        {/* TOP BAR */}
        <div className="asq-topbar">
          <div className="asq-topbar-left">
            <Link to="/admin/matches" className="asq-back-link">
              ← Back to Matches
            </Link>

            <div className="asq-title-wrap">
              <h1 className="asq-title">Score Quiz Responses</h1>
              <p className="asq-subtitle">
                Calculate final scores after correct answers are set.
              </p>
            </div>
          </div>

          <div className="asq-topbar-actions">
            <button
              type="button"
              className="asq-btn asq-btn-ghost"
              onClick={loadData}
              disabled={loading || scoring}
            >
              Refresh
            </button>

            <button
              type="button"
              className="asq-btn asq-btn-secondary"
              onClick={() => navigate(`/admin/matches/${matchId}/answers`)}
              disabled={loading || scoring}
              title="Set correct answers before scoring"
            >
              Go to Set Answers
            </button>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="asq-card">
          <div className="asq-card-head">
            <div>
              <h2 className="asq-card-title">Scoring Checklist</h2>
              <p className="asq-card-desc">
                Ensure answers are finalized. Scoring will compute points for
                all submitted responses.
              </p>
            </div>

            <div className="asq-chips">
              <div className={`asq-chip asq-chip-${status.toLowerCase()}`}>
                Status: <b>{status}</b>
              </div>
              <div className={`asq-chip ${quizId ? "ok" : "bad"}`}>
                Quiz: <b>{quizId ? "FOUND" : "NOT FOUND"}</b>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="asq-state">
              <div className="asq-spinner" />
              Loading match…
            </div>
          ) : (
            <div className="asq-body">
              {/* Alerts */}
              <div className="asq-messages">
                {errorMsg && (
                  <div className="asq-alert asq-alert-error">{errorMsg}</div>
                )}

                {result && (
                  <div className="asq-alert asq-alert-success">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <b>{result.message}</b>
                        <div className="asq-success-sub">
                          Responses scored: <b>{result.scoredCount}</b>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="asq-btn asq-btn-ghost"
                          onClick={() => navigate(`/admin/matches/${matchId}/leaderboard`)}
                        >
                          Preview Leaderboard
                        </button>
                        <button
                          type="button"
                          className="asq-btn asq-btn-secondary"
                          onClick={() => navigate(`/admin/matches/${matchId}/publish`)}
                        >
                          Publish Results →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="asq-meta-grid">
                <div className="asq-meta-item">
                  <div className="asq-meta-label">Match</div>
                  <div className="asq-meta-value">{match?.title || "-"}</div>
                </div>

                <div className="asq-meta-item">
                  <div className="asq-meta-label">Tournament</div>
                  <div className="asq-meta-value">
                    {match?.tournament || "-"}
                  </div>
                </div>

                <div className="asq-meta-item">
                  <div className="asq-meta-label">Match ID</div>
                  <div className="asq-meta-value asq-mono">{matchId}</div>
                </div>

                <div className="asq-meta-item">
                  <div className="asq-meta-label">Quiz ID</div>
                  <div className="asq-meta-value asq-mono">{quizId || "-"}</div>
                </div>
              </div>

              <div className="asq-divider" />

              {/* Action */}
              <div className="asq-action-row">
                <div className="asq-warning">
                  <div className="asq-warning-title">Before you score</div>
                  <ul className="asq-warning-list">
                    <li>Match status must be COMPLETED</li>
                    <li>Correct answers must be set for all questions</li>
                    <li>Do scoring once after finalizing answers</li>
                  </ul>
                </div>

                <div className="asq-action">
                  <button
                    type="button"
                    className="asq-btn asq-btn-primary asq-btn-wide"
                    disabled={!canScore}
                    onClick={handleScore}
                  >
                    {scoring ? "Scoring…" : "Score Responses"}
                  </button>

                  <div className="asq-note">
                    ⚠️ Ensure correct answers are set before scoring.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="asq-foot">
          Tip: After scoring, go to <b>Publish Results</b> to make results
          visible to users.
        </div>
      </div>
    </div>
  );
}
