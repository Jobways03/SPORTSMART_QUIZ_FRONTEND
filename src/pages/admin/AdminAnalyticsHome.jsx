import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/adminAnalytics.css";
import { adminFetchQuizzes } from "../../services/adminQuiz.service";

export default function AdminAnalyticsHome() {
  const [quizzes, setQuizzes] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await adminFetchQuizzes();
        const list = Array.isArray(res) ? res : res?.quizzes || [];
        setQuizzes(list);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return quizzes;
    return quizzes.filter((x) => {
      const title = (x.title || "").toLowerCase();
      const matchTitle = (x.matchId?.title || "").toLowerCase();
      return title.includes(needle) || matchTitle.includes(needle);
    });
  }, [quizzes, q]);

  return (
    <div className="admin-page">
      <div className="admin-analytics-header">
        <div>
          <h2>Detailed Analytics</h2>
          <p className="analytics-subtitle">
            Pick a quiz to view heatmap, top users, timing, and more.
          </p>
        </div>
        <Link to="/admin/dashboard" className="secondary-action-btn">
          ← Back
        </Link>
      </div>

      <div className="filter-row">
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by quiz title or match title…"
        />
      </div>

      {loading && <div className="admin-loading">Loading quizzes…</div>}
      {error && <div className="admin-error">{error}</div>}

      {!loading && !error && (
        <div className="quiz-grid">
          {filtered.length === 0 ? (
            <div className="chart-card">No quizzes found.</div>
          ) : (
            filtered.map((quiz) => {
              const id = quiz._id || quiz.id;
              return (
                <div key={id} className="quiz-card">
                  <div className="quiz-card-title">{quiz.title}</div>
                  <div className="quiz-card-sub">
                    Match: <b>{quiz.matchId?.title || "N/A"}</b>
                  </div>

                  <div className="quiz-chip-row">
                    <span
                      className={`chip ${
                        quiz.isLocked ? "chip-red" : "chip-green"
                      }`}
                    >
                      {quiz.isLocked ? "Locked" : "Active"}
                    </span>
                    <span
                      className={`chip ${
                        quiz.isResultPublished ? "chip-green" : "chip-yellow"
                      }`}
                    >
                      {quiz.isResultPublished ? "Published" : "Not Published"}
                    </span>
                  </div>

                  <Link
                    to={`/admin/analytics/quizzes/${id}`}
                    className="primary-action-btn"
                    style={{ width: "fit-content" }}
                  >
                    View Quiz Analytics →
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
