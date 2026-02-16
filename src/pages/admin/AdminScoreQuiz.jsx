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
      setQuizId(sessionStorage.getItem(`quiz_${matchId}`));
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

  return (
    <div className="adm-sq-page">
      <div className="adm-sq-wrap">
        <Link to="/admin/matches" className="adm-sq-back">
          ← Back to Matches
        </Link>

        <header className="adm-sq-header">
          <h1 className="adm-sq-title">Score Quiz Responses</h1>
          <p className="adm-sq-subtitle">
            Calculate final scores after correct answers are set
          </p>
        </header>

        {loading && <div className="adm-sq-info">Loading…</div>}

        {!loading && (
          <>
            <div className="adm-sq-meta">
              <div className="adm-sq-chip">
                Status: <b>{match?.status || "UNKNOWN"}</b>
              </div>
              <div className="adm-sq-chip">
                Quiz: <b>{quizId ? "FOUND" : "NOT FOUND"}</b>
              </div>
            </div>

            {errorMsg && <div className="adm-sq-error">{errorMsg}</div>}

            {result && (
              <div className="adm-sq-success">
                <b>{result.message}</b>
                <div>Responses scored: {result.scoredCount}</div>
              </div>
            )}

            <div className="adm-sq-action">
              <button
                className="adm-sq-btn"
                disabled={match?.status !== "COMPLETED" || scoring}
                onClick={handleScore}
              >
                {scoring ? "Scoring…" : "Score Responses"}
              </button>

              <p className="adm-sq-note">
                ⚠️ Ensure correct answers are set before scoring.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
