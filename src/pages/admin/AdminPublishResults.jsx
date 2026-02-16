import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminPublishResults } from "../../services/adminPublish.service";
import "../../styles/admin-publish-results.css";

export default function AdminPublishResults() {
  const { matchId } = useParams();

  const [quizId, setQuizId] = useState(null);
  const [match, setMatch] = useState(null);

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
      setQuizId(sessionStorage.getItem(`quiz_${matchId}`));
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

  return (
    <div className="adm-pr-page">
      <div className="adm-pr-wrap">
        <Link to="/admin/matches" className="adm-pr-back">
          ← Back to Matches
        </Link>

        <header className="adm-pr-header">
          <h1 className="adm-pr-title">Publish Quiz Results</h1>
          <p className="adm-pr-subtitle">
            Make final scores visible to users and leaderboard.
          </p>
        </header>

        {loading && <div className="adm-pr-info">Loading…</div>}

        {!loading && (
          <>
            <div className="adm-pr-meta">
              <div className="adm-pr-chip">
                Status: <b>{match?.status || "UNKNOWN"}</b>
              </div>
              <div className="adm-pr-chip">
                Quiz: <b>{quizId ? "FOUND" : "NOT FOUND"}</b>
              </div>
            </div>

            {errorMsg && <div className="adm-pr-error">{errorMsg}</div>}
            {successMsg && <div className="adm-pr-success">{successMsg}</div>}

            <div className="adm-pr-action">
              <button
                className="adm-pr-btn adm-pr-btn-danger"
                disabled={match?.status !== "COMPLETED" || publishing}
                onClick={handlePublish}
              >
                {publishing ? "Publishing…" : "Publish Results"}
              </button>

              <p className="adm-pr-note">
                ⚠️ Publish only after scoring responses is completed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
