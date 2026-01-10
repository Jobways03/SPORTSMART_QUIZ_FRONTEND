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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("Failed to load match data");
    } finally {
      setLoading(false);
    }
  };

  const onPublish = async () => {
    setError("");
    setSuccess("");

    if (!quizId) return setError("Quiz not found for this match");
    if (match?.status !== "COMPLETED") {
      return setError("Match must be COMPLETED before publishing results");
    }

    try {
      setPublishing(true);
      const res = await adminPublishResults(quizId);
      setSuccess(res?.message || "Results published successfully");
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Results already published or cannot publish"
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <Link to="/admin/matches" className="back-link">
          ← Back to Matches
        </Link>
        <header className="admin-header">
          <h1>Publish Quiz Results</h1>
          <p className="subtitle">
            Make final scores visible to users & leaderboard
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

            {success && <div className="success-box">{success}</div>}

            <div className="action-card">
              <button
                className="primary-btn danger"
                disabled={match?.status !== "COMPLETED" || publishing}
                onClick={onPublish}
              >
                {publishing ? "Publishing…" : "Publish Results"}
              </button>

              <p className="note">
                ⚠️ Publish only after scoring responses is completed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
