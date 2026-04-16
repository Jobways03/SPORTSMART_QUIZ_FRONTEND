import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import "../../styles/admin-score-publish-hub.css";

const STATUS_ORDER = { COMPLETED: 0, LIVE: 1, UPCOMING: 2 };

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminScorePublishHub() {
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
    completed: matches.filter((m) => m.status === "COMPLETED").length,
    live:      matches.filter((m) => m.status === "LIVE").length,
  }), [matches]);

  return (
    <div className="sph-page">
      {/* ── HEADER ── */}
      <div className="sph-header">
        <div>
          <div className="sph-title">Score & Publish</div>
          <div className="sph-sub">Select a match to score responses or publish results</div>
        </div>
        <Link to="/admin/matches" className="sph-back-btn">← Back</Link>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="sph-tabs">
        {[
          { key: "ALL",       label: `All (${counts.all})` },
          { key: "COMPLETED", label: `Completed (${counts.completed})` },
          { key: "LIVE",      label: `Live (${counts.live})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`sph-tab ${filter === key ? "sph-tab--active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── SKELETONS ── */}
      {loading && (
        <div className="sph-grid">
          {[1,2,3].map((i) => <div key={i} className="sph-skeleton" />)}
        </div>
      )}
      {error && <div className="sph-error">{error}</div>}

      {/* ── CARD GRID ── */}
      {!loading && !error && (
        <div className="sph-grid">
          {sorted.length === 0 && (
            <div className="sph-empty">No matches found for this filter.</div>
          )}

          {sorted.map((m) => {
            const id     = m._id || m.id;
            const status = m.status || "UNKNOWN";

            return (
              <div
                key={id}
                className="sph-card sph-card--clickable"
                onClick={() => navigate(`/admin/matches/${id}/score`)}
              >
                {/* Cover */}
                <div className="sph-card-cover">
                  {m.coverImage ? (
                    <img src={m.coverImage} alt={m.title} className="sph-card-img" />
                  ) : (
                    <div className="sph-card-img sph-card-img--empty">🏏</div>
                  )}
                  <div className={`sph-status sph-status--${status.toLowerCase()}`}>
                    {status === "LIVE" && <span className="sph-live-dot" />}
                    {status}
                  </div>
                </div>

                {/* Body */}
                <div className="sph-card-body">
                  <div className="sph-card-title">{m.title || "Untitled"}</div>
                  <div className="sph-card-meta">
                    📅 {fmtDate(m.startTime)}
                    {fmtTime(m.startTime) ? ` · ${fmtTime(m.startTime)}` : ""}
                  </div>
                  {m.tournament && (
                    <div className="sph-card-tournament">🏆 {m.tournament}</div>
                  )}
                </div>

                {/* Static status display */}
                <div className="sph-card-actions">
                  <div className={`sph-status-label sph-status-label--${status.toLowerCase()}`}>
                    {status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TIP ── */}
      {!loading && (
        <div className="sph-tip">
          💡 Only <b>COMPLETED</b> matches can be scored and published.
          Change match status in <Link to="/admin/matches" className="sph-tip-link">Match Management</Link>.
        </div>
      )}
    </div>
  );
}
