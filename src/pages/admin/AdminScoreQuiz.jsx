import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminScoreQuiz } from "../../services/adminScore.service";
import "../../styles/admin-score-quiz.css";

export default function AdminScoreQuiz() {
  const { matchId } = useParams();

  const [quizId, setQuizId] = useState(null);
  const [match, setMatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [matchId]);

  const load = async () => {
    try {
      const data = await adminFetchMatches();
      const list = Array.isArray(data) ? data : data.matches || [];
      const found = list.find((m) => (m._id || m.id) === matchId);

      setMatch(found || null);
      setQuizId(sessionStorage.getItem(`quiz_${matchId}`));
    } catch {
      setError("Failed to load match information");
    } finally {
      setLoading(false);
    }
  };

  const onScore = async () => {
    setError("");
    setResult(null);

    if (!quizId) return setError("Quiz not found for this match");
    if (match?.status !== "COMPLETED") {
      return setError("Match must be COMPLETED before scoring");
    }

    try {
      setScoring(true);
      const res = await adminScoreQuiz(quizId);
      setResult(res);
    } catch (e) {
      setError(e?.response?.data?.message || "Scoring failed");
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <Link
          to="/admin/matches"
          className="back-link"
          style={{ marginBottom: "30px" }}
        >
          ← Back to Matches
        </Link>
        <header className="admin-header">
          <h1>Score Quiz Responses</h1>
          <p className="subtitle">
            Calculate final scores after correct answers are set
          </p>
        </header>

        {loading && <div className="info-box">Loading…</div>}

        {!loading && (
          <>
            <div className="meta-card">
              {/* <div>
                <span>Match ID</span>
                <code>{matchId}</code>
              </div> */}
              <div>
                <span>Status</span>
                <b>{match?.status || "UNKNOWN"}</b>
              </div>
              {/* <div>
                <span>Quiz ID</span>
                <code>{quizId || "NOT FOUND"}</code>
              </div> */}
            </div>

            {error && <div className="error-box">{error}</div>}

            {result && (
              <div className="success-box">
                <b>{result.message}</b>
                <div>Responses scored: {result.scoredCount}</div>
              </div>
            )}

            <div className="action-card">
              <button
                className="primary-btn"
                disabled={match?.status !== "COMPLETED" || scoring}
                onClick={onScore}
              >
                {scoring ? "Scoring…" : "Score Responses"}
              </button>

              <p className="note">
                ⚠️ Ensure correct answers are set before scoring.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
