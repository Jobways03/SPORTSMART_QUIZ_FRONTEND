import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminFetchMatches } from "../../services/adminMatch.service";
import "../../styles/admin-quiz-hub.css";

const STATUS_ORDER = { LIVE: 0, UPCOMING: 1, COMPLETED: 2 };

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminQuizHub() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("ALL");

  const loadMatches = () => {
    adminFetchMatches()
      .then((data) => setMatches(Array.isArray(data) ? data : data?.matches || []))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load matches"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMatches(); }, []);

const sorted = useMemo(() => {
    const list = filter === "ALL"
      ? matches
      : matches.filter((m) => m.status === filter);
    return [...list].sort(
      (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
    );
  }, [matches, filter]);

  const counts = useMemo(() => ({
    all:       matches.length,
    live:      matches.filter((m) => m.status === "LIVE").length,
    upcoming:  matches.filter((m) => m.status === "UPCOMING").length,
    completed: matches.filter((m) => m.status === "COMPLETED").length,
  }), [matches]);

  return (
    <div className="qh-page">
      {/* ── HEADER ── */}
      <div className="qh-header">
        <div>
          <div className="qh-title">Quizzes & Answers</div>
          <div className="qh-sub">Select a match to manage its quiz or set correct answers</div>
        </div>
        <Link to="/admin/matches" className="qh-back-btn">← Back</Link>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="qh-tabs">
        {[
          { key: "ALL",       label: `All (${counts.all})` },
          { key: "LIVE",      label: `Live (${counts.live})` },
          { key: "UPCOMING",  label: `Upcoming (${counts.upcoming})` },
          { key: "COMPLETED", label: `Completed (${counts.completed})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`qh-tab ${filter === key ? "qh-tab--active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── STATES ── */}
      {loading && (
        <div className="qh-skeletons">
          {[1,2,3,4].map((i) => <div key={i} className="qh-skeleton" />)}
        </div>
      )}
      {error && <div className="qh-error">{error}</div>}

      {/* ── GRID ── */}
      {!loading && !error && (
        <div className="qh-grid">
          {sorted.length === 0 && (
            <div className="qh-empty">No matches found.</div>
          )}

          {sorted.map((m) => {
            const id     = m._id || m.id;
            const status = m.status || "UNKNOWN";

            return (
              <div
                key={id}
                className="qh-card qh-card--clickable"
                onClick={() => navigate(`/admin/quizzes/${id}`)}
              >
                {/* Cover */}
                <div className="qh-card-cover">
                  {m.coverImage ? (
                    <img src={m.coverImage} alt={m.title} className="qh-card-img" />
                  ) : (
                    <div className="qh-card-img qh-card-img--empty">🏏</div>
                  )}
                  <div className={`qh-status qh-status--${status.toLowerCase()}`}>
                    {status === "LIVE" && <span className="qh-live-dot" />}
                    {status}
                  </div>
                </div>

                {/* Body */}
                <div className="qh-card-body">
                  <div className="qh-card-title">{m.title || "Untitled"}</div>
                  <div className="qh-card-meta">📅 {fmtDate(m.startTime)}</div>
                  {m.tournament && (
                    <div className="qh-card-tournament">🏆 {m.tournament}</div>
                  )}
                </div>

                {/* Static status */}
                <div className="qh-card-actions">
                  <div className={`qh-status-label qh-status-label--${status.toLowerCase()}`}>
                    {status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
