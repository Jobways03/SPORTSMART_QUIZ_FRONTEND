import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminFetchQuizzesByMatch } from "../../services/adminQuiz.service";
import { adminPublishResults } from "../../services/adminPublish.service";
import { getWinnerOverride } from "../../services/adminOverride.service";
import "../../styles/admin-publish-results.css";

export default function AdminPublishResults() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [match, setMatch] = useState(null);
  const [override, setOverride] = useState(undefined); // undefined=loading, null=none, obj=exists

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const data = await adminFetchMatches();
      const list = Array.isArray(data) ? data : data?.matches || [];
      const found = list.find((m) => (m._id || m.id) === matchId);

      setMatch(found || null);

      const quizzes = await adminFetchQuizzesByMatch(matchId);
      const quizList = Array.isArray(quizzes) ? quizzes : [];
      const foundQuiz = quizList[0];
      const qId = foundQuiz ? (foundQuiz._id || foundQuiz.id) : null;
      setQuizId(qId);

      if (qId) {
        try {
          const overrideData = await getWinnerOverride(qId);
          setOverride(overrideData?.override || null);
        } catch {
          setOverride(null);
        }
      } else {
        setOverride(null);
      }
    } catch {
      setErrorMsg("Failed to load match data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!quizId) return setErrorMsg("Quiz not found for this match.");
    if (match?.status !== "COMPLETED") {
      return setErrorMsg("Match must be COMPLETED before publishing results.");
    }

    try {
      setPublishing(true);
      const res = await adminPublishResults(quizId);
      setSuccessMsg(res?.message || "Results published successfully.");
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          "Results already published or cannot publish.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const status = match?.status || "UNKNOWN";
  const canPublish = quizId && status === "COMPLETED" && !publishing;

  return (
    <div className="appr-page">
      <div className="appr-container">
        {/* TOP BAR */}
        <div className="appr-topbar">
          <div className="appr-topbar-left">
            <Link to="/admin/matches" className="appr-back-link">
              ← Back to Matches
            </Link>
            <div className="appr-title-wrap">
              <h1 className="appr-title">Publish Results</h1>
              <p className="appr-subtitle">
                Make final scores visible to users & leaderboard.
              </p>
            </div>
          </div>

          <div className="appr-topbar-actions">
            <button
              type="button"
              className="appr-btn appr-btn-ghost"
              onClick={loadData}
              disabled={loading || publishing}
            >
              Refresh
            </button>

            <button
              type="button"
              className="appr-btn appr-btn-secondary"
              onClick={() => navigate(`/admin/matches/${matchId}/score`)}
              disabled={loading || publishing}
              title="Score responses before publishing"
            >
              Go to Scoring
            </button>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="appr-card">
          <div className="appr-card-head">
            <div className="appr-card-head-left">
              <h2 className="appr-card-title">Publishing Checklist</h2>
              <p className="appr-card-desc">
                Publish only after answers are set and quiz scoring is
                completed.
              </p>
            </div>

            <div className="appr-chips">
              <div className={`appr-chip appr-chip-${status.toLowerCase()}`}>
                Status: <b>{status}</b>
              </div>
              <div className={`appr-chip ${quizId ? "ok" : "bad"}`}>
                Quiz: <b>{quizId ? "FOUND" : "NOT FOUND"}</b>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="appr-state">
              <div className="appr-spinner" />
              Loading match…
            </div>
          ) : (
            <>
              {(errorMsg || successMsg) && (
                <div className="appr-messages">
                  {errorMsg && (
                    <div className="appr-alert appr-alert-error">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="appr-alert appr-alert-success">
                      {successMsg}
                    </div>
                  )}
                </div>
              )}

              <div className="appr-body">
                <div className="appr-meta-grid">
                  <div className="appr-meta-item">
                    <div className="appr-meta-label">Match</div>
                    <div className="appr-meta-value">{match?.title || "-"}</div>
                  </div>

                  <div className="appr-meta-item">
                    <div className="appr-meta-label">Tournament</div>
                    <div className="appr-meta-value">
                      {match?.tournament || "-"}
                    </div>
                  </div>

                  <div className="appr-meta-item">
                    <div className="appr-meta-label">Match ID</div>
                    <div className="appr-meta-value appr-mono">{matchId}</div>
                  </div>

                  <div className="appr-meta-item">
                    <div className="appr-meta-label">Quiz ID</div>
                    <div className="appr-meta-value appr-mono">
                      {quizId || "-"}
                    </div>
                  </div>
                </div>

                <div className="appr-divider" />

                {/* OVERRIDE STATUS */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Winner Override
                  </div>
                  {override === undefined ? (
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>Checking…</div>
                  ) : override ? (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 12, background: "#f0fdf4", border: "1px solid #6ee7b7",
                      borderRadius: 8, padding: "10px 14px", flexWrap: "wrap"
                    }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginRight: 8 }}>
                          🏆 ACTIVE
                        </span>
                        <span style={{ fontSize: 13, color: "#064e3b", fontWeight: 600 }}>
                          {override.displayName}
                        </span>
                        <span style={{ fontSize: 13, color: "#047857", marginLeft: 8 }}>
                          — {override.score} pts → Rank #1
                        </span>
                      </div>
                      <button
                        type="button"
                        className="appr-btn appr-btn-ghost"
                        style={{ fontSize: 12, padding: "4px 12px" }}
                        onClick={() => navigate(`/admin/matches/${matchId}/override`)}
                      >
                        Manage Override →
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 12, background: "#fafafa", border: "1px solid #e5e7eb",
                      borderRadius: 8, padding: "10px 14px", flexWrap: "wrap"
                    }}>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>
                        No override set — normal ranking will apply.
                      </span>
                      <button
                        type="button"
                        className="appr-btn appr-btn-ghost"
                        style={{ fontSize: 12, padding: "4px 12px" }}
                        onClick={() => navigate(`/admin/matches/${matchId}/override`)}
                      >
                        Set Override →
                      </button>
                    </div>
                  )}
                </div>

                <div className="appr-divider" />

                <div className="appr-action-row">
                  <div className="appr-warning">
                    <div className="appr-warning-title">Before you publish</div>
                    <ul className="appr-warning-list">
                      <li>Set correct answers for all questions</li>
                      <li>Score all submissions</li>
                      <li>Confirm match status is COMPLETED</li>
                    </ul>
                  </div>

                  <div className="appr-action">
                    <button
                      type="button"
                      className="appr-btn appr-btn-danger appr-btn-wide"
                      disabled={!canPublish}
                      onClick={handlePublish}
                    >
                      {publishing ? "Publishing…" : "Publish Results"}
                    </button>

                    <div className="appr-note">
                      ⚠️ This will make results visible to all users.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOT NOTE */}
        <div className="appr-foot">
          Tip: If Quiz shows “NOT FOUND”, create/manage quiz from{" "}
          <b>Manage Quiz</b> and ensure quizId is stored.
        </div>
      </div>
    </div>
  );
}
