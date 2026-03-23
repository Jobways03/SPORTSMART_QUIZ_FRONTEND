import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminFetchQuizzesByMatch } from "../../services/adminQuiz.service";
import {
  createWinnerOverride,
  getWinnerOverride,
  deleteWinnerOverride,
} from "../../services/adminOverride.service";
import "../../styles/admin-winner-override.css";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminWinnerOverride() {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [override, setOverride] = useState(null); // null = none, object = exists

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* FORM STATE */
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [score, setScore] = useState("");

  /* ─── LOAD ─── */
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const matches = await adminFetchMatches();
      const list = Array.isArray(matches) ? matches : matches?.matches || [];
      const found = list.find((m) => (m._id || m.id) === matchId);
      setMatch(found || null);

      const quizzes = await adminFetchQuizzesByMatch(matchId);
      const quizList = Array.isArray(quizzes) ? quizzes : [];
      const foundQuiz = quizList[0];
      const qId = foundQuiz ? foundQuiz._id || foundQuiz.id : null;
      setQuizId(qId);

      if (qId) {
        const data = await getWinnerOverride(qId);
        setOverride(data?.override || null);
      }
    } catch {
      setErrorMsg("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  /* ─── CREATE OVERRIDE ─── */
  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!displayName.trim()) return setErrorMsg("Display name is required.");
    const parsedScore = Number(score);
    if (isNaN(parsedScore) || parsedScore < 0) {
      return setErrorMsg("Score must be a non-negative number.");
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      return setErrorMsg("Phone must be exactly 10 digits.");
    }
    if (!quizId) return setErrorMsg("Quiz not found for this match.");

    try {
      setSaving(true);
      const res = await createWinnerOverride(quizId, {
        displayName: displayName.trim(),
        phone: phone.trim() || undefined,
        score: parsedScore,
      });
      setOverride(res.override);
      setSuccessMsg("Winner override set successfully! This user will appear as Rank #1.");
      setDisplayName("");
      setPhone("");
      setScore("");
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || "Failed to create override."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ─── REMOVE OVERRIDE ─── */
  const handleRemove = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      setRemoving(true);
      await deleteWinnerOverride(quizId);
      setOverride(null);
      setSuccessMsg("Winner override removed. Normal ranking restored.");
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || "Failed to remove override."
      );
    } finally {
      setRemoving(false);
    }
  };

  const isPublished = match?.isResultPublished;
  const status = match?.status || "UNKNOWN";

  return (
    <div className="awo-page">
      <div className="awo-container">
        {/* TOP BAR */}
        <div className="awo-topbar">
          <div>
            <Link to="/admin/matches" className="awo-back-link">
              ← Back to Matches
            </Link>
            <h1 className="awo-title">Override Winner</h1>
            <p className="awo-subtitle">
              Force a custom user to appear as Rank #1 on the leaderboard.
            </p>
          </div>

          <button
            type="button"
            className="awo-btn awo-btn-ghost"
            onClick={loadData}
            disabled={loading || saving || removing}
          >
            Refresh
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="awo-card">
          <div className="awo-card-head">
            <div>
              <h2 className="awo-card-title">Override Control</h2>
              <p className="awo-card-desc">
                {match?.title || "Loading match…"}
                {match?.tournament ? ` · ${match.tournament}` : ""}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="awo-chip">Status: {status}</span>
              {override ? (
                <span className="awo-chip awo-chip-active">Override Active</span>
              ) : (
                <span className="awo-chip awo-chip-none">No Override</span>
              )}
            </div>
          </div>

          <div className="awo-card-body">
            {loading ? (
              <div className="awo-state">
                <div className="awo-spinner" />
                Loading…
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="awo-alert awo-alert-error">{errorMsg}</div>
                )}
                {successMsg && (
                  <div className="awo-alert awo-alert-success">{successMsg}</div>
                )}

                {isPublished && (
                  <div className="awo-alert awo-alert-warn">
                    Results are already published. Override cannot be modified.
                  </div>
                )}

                {!quizId && (
                  <div className="awo-alert awo-alert-warn">
                    No quiz found for this match. Create a quiz from Manage Quiz first.
                  </div>
                )}

                {/* ── OVERRIDE ACTIVE ── */}
                {override ? (
                  <>
                    <div className="awo-override-active">
                      <div className="awo-override-badge">
                        🏆 Active Override — Rank #1
                      </div>
                      <div className="awo-override-name">{override.displayName}</div>
                      <div className="awo-override-score">{override.score} points</div>
                      {override.phone && (
                        <div className="awo-override-meta" style={{ marginBottom: 4 }}>
                          📞 {override.phone}
                        </div>
                      )}
                      <div className="awo-override-meta">
                        Set on {formatDate(override.createdAt)}
                      </div>
                    </div>

                    {!isPublished && (
                      <div className="awo-actions">
                        <button
                          type="button"
                          className="awo-btn awo-btn-danger"
                          onClick={handleRemove}
                          disabled={removing}
                        >
                          {removing ? "Removing…" : "Remove Override"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* ── CREATE FORM ── */
                  !isPublished && quizId && (
                    <form className="awo-form" onSubmit={handleCreate}>
                      <div className="awo-field">
                        <label className="awo-label" htmlFor="displayName">
                          Winner Display Name <span className="awo-required">*</span>
                        </label>
                        <input
                          id="displayName"
                          className="awo-input"
                          type="text"
                          placeholder="e.g. John Doe"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={saving}
                          required
                        />
                        <span className="awo-hint">
                          This name will appear as Rank #1 on the public leaderboard.
                        </span>
                      </div>

                      <div className="awo-field">
                        <label className="awo-label" htmlFor="phone">
                          Phone Number <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          id="phone"
                          className="awo-input"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          disabled={saving}
                        />
                        <span className="awo-hint">10-digit number shown on the leaderboard.</span>
                      </div>

                      <div className="awo-field">
                        <label className="awo-label" htmlFor="score">
                          Score <span className="awo-required">*</span>
                        </label>
                        <input
                          id="score"
                          className="awo-input"
                          type="number"
                          placeholder="e.g. 150"
                          min="0"
                          step="1"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          disabled={saving}
                          required
                        />
                        <span className="awo-hint">
                          Can be any value — this user is always ranked #1 regardless.
                        </span>
                      </div>

                      <div className="awo-divider" />

                      <div className="awo-actions">
                        <button
                          type="submit"
                          className="awo-btn awo-btn-primary"
                          disabled={saving}
                        >
                          {saving ? "Setting Override…" : "Set Override Winner"}
                        </button>
                      </div>
                    </form>
                  )
                )}
              </>
            )}
          </div>
        </div>

        <div className="awo-foot">
          Override is only allowed before results are published. One override per quiz.
        </div>
      </div>
    </div>
  );
}
