import React, { useEffect, useRef, useState } from "react";
import { fetchMatches } from "../services/match.service";
import { fetchUserResults } from "../services/result.service";
import MatchCard from "../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getMatchStatus } from "../utils/time";
import "../styles/matches.css";

export default function Matches() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile sheet
  const [profileOpen, setProfileOpen] = useState(false);
  const sheetRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMatches();
      const list = Array.isArray(data) ? data : data?.matches || [];

      const visible = [];

      for (const raw of list) {
        const match = normalizeMatch(raw);
        const status = getMatchStatus(match);

        if (status === "CANCELLED") continue;

        if (status === "UPCOMING" || status === "LIVE") {
          visible.push(match);
          continue;
        }

        if (status === "COMPLETED") {
          if (!match.quizId) {
            console.warn("Missing quizId for match", match.id);
            visible.push(match);
            continue;
          }

          try {
            await fetchUserResults({
              quizId: match.quizId,
              userId: user.userId,
            });
            visible.push(match);
          } catch (e) {
            const msg = e?.response?.data?.message;
            const published = e?.response?.data?.published;

            if (msg === "You did not participate in this quiz") continue;
            if (published === false) visible.push(match);
          }
        }
      }

      setMatches(visible);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load matches.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line
  }, [user?.userId]);

  // Close on ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (!parts.length) return "U";
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="sm-matches">
      {/* Background */}
      <div className="sm-bg-pattern" aria-hidden="true" />
      <div className="sm-glow sm-glow--tl" aria-hidden="true" />
      <div className="sm-glow sm-glow--br" aria-hidden="true" />

      {/* App Shell */}
      <div className="sm-shell">
        {/* Top Bar */}
        <header className="sm-topbar">
          <div className="sm-topbar-left">
            <div className="sm-topbar-title">Matches</div>
            <div className="sm-topbar-sub">
              {loading ? "Loading…" : `${matches.length} available`}
            </div>
          </div>

          <div className="sm-topbar-right">
            <button
              type="button"
              className="sm-icon-btn"
              onClick={load}
              disabled={loading}
              aria-label="Refresh matches"
              title="Refresh"
            >
              <span className="sm-mi" aria-hidden="true">
                refresh
              </span>
            </button>

            <button
              type="button"
              className="sm-avatar-btn"
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile"
            >
              <span className="sm-avatar">{getInitials(user?.name)}</span>
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="sm-alert sm-alert--error" role="alert">
            <div className="sm-alert-title">Error</div>
            <div className="sm-alert-text">{error}</div>
          </div>
        )}

        {/* Content */}
        <main className="sm-content">
          {loading ? (
            <div className="sm-skeleton-wrap">
              <div className="sm-skeleton-card" />
              <div className="sm-skeleton-card" />
              <div className="sm-skeleton-card" />
            </div>
          ) : matches.length === 0 ? (
            <div className="sm-empty">
              <div className="sm-empty-card">
                <div className="sm-empty-icon" aria-hidden="true">
                  🏏
                </div>
                <div className="sm-empty-title">No matches available</div>
                <div className="sm-empty-text">
                  Matches will appear here when available. Try refreshing.
                </div>

                <button
                  type="button"
                  className="sm-btn sm-btn--primary"
                  onClick={load}
                >
                  <span className="sm-btn-mi" aria-hidden="true">
                    refresh
                  </span>
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="sm-grid">
              {matches.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  onViewQuiz={() => navigate(`/quiz/${m.id}`)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Overlay */}
        {profileOpen && (
          <div
            className="sm-overlay"
            onClick={() => setProfileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Bottom Sheet */}
        <div className={`sm-sheet ${profileOpen ? "open" : ""}`} ref={sheetRef}>
          <div className="sm-sheet-handle" />

          <div className="sm-sheet-head">
            <div className="sm-sheet-avatar">{getInitials(user?.name)}</div>

            <div className="sm-sheet-meta">
              <div className="sm-sheet-name">{user?.name || "User"}</div>
              <div className="sm-sheet-email">{user?.email || "-"}</div>
            </div>

            <button
              type="button"
              className="sm-sheet-close"
              onClick={() => setProfileOpen(false)}
              aria-label="Close"
              title="Close"
            >
              <span className="sm-mi" aria-hidden="true">
                close
              </span>
            </button>
          </div>

          <div className="sm-sheet-info">
            <div className="sm-row">
              <span className="sm-row-k">Phone</span>
              <b className="sm-row-v">{user?.phone || "-"}</b>
            </div>
            <div className="sm-row">
              <span className="sm-row-k">User ID</span>
              <b className="sm-row-v sm-mono">{user?.userId || "-"}</b>
            </div>
          </div>

          <button
            type="button"
            className="sm-btn sm-btn--danger"
            onClick={onLogout}
          >
            <span className="sm-btn-mi" aria-hidden="true">
              logout
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeMatch(m) {
  return {
    id: m.id || m._id,
    quizId: m.quizId,
    title: m.title,
    tournament: m.tournament,
    startTime: m.startTime,
    status: m.status,
    coverImage: m.coverImage,
  };
}
