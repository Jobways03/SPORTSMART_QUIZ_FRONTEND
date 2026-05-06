import React, { useEffect, useRef, useState } from "react";
import { fetchMatches } from "../services/match.service";
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

      const visible = list
        .map(normalizeMatch)
        .filter((m) => getMatchStatus(m) !== "CANCELLED");

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

  useEffect(() => { document.title = "Matches | Sports Arena"; }, []);

  // Refetch when user returns to tab (so admin updates show up without a hard reload)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && user?.userId) load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
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

  const firstName = (user?.name || "Player").split(" ")[0];

  return (
    <div className="sm-matches">
      {/* Background */}
      <div className="sm-bg-pattern" aria-hidden="true" />

      {/* App Shell */}
      <div className="sm-shell">
        {/* ── Navbar ── */}
        <nav className="sm-nav">
          <div className="sm-nav-brand">
            <div className="sm-nav-logo">SA</div>
            <div>
              <div className="sm-nav-name">Sportsmart Quiz</div>
            </div>
          </div>

          <div className="sm-nav-actions">
            <button
              type="button"
              className="sm-nav-icon-btn"
              onClick={load}
              disabled={loading}
              aria-label="Refresh"
              title="Refresh matches"
            >
              <span className="sm-mi" aria-hidden="true">refresh</span>
            </button>

            <button
              type="button"
              className="sm-nav-avatar-btn"
              onClick={() => setProfileOpen(true)}
              aria-label="Profile"
            >
              <span className="sm-nav-avatar">{getInitials(user?.name)}</span>
            </button>
          </div>
        </nav>

        {/* ── Hero Section ── */}
        <section className="sm-hero">
          <div className="sm-hero-content">
            <p className="sm-hero-tag">WELCOME BACK</p>
            <h1 className="sm-hero-title">{firstName}</h1>
            <p className="sm-hero-sub">
              {loading
                ? "Loading your matches..."
                : matches.length > 0
                  ? `${matches.length} match${matches.length > 1 ? "es" : ""} available to play`
                  : "No matches available right now"}
            </p>
          </div>
          <div className="sm-hero-stats">
            <div className="sm-stat">
              <span className="sm-stat-value">{matches.filter(m => getMatchStatus(m) === "LIVE" || getMatchStatus(m) === "UPCOMING").length}</span>
              <span className="sm-stat-label">Active</span>
            </div>
            <div className="sm-stat-divider" />
            <div className="sm-stat">
              <span className="sm-stat-value">{matches.filter(m => getMatchStatus(m) === "COMPLETED").length}</span>
              <span className="sm-stat-label">Completed</span>
            </div>
            <div className="sm-stat-divider" />
            <div className="sm-stat">
              <span className="sm-stat-value">{matches.length}</span>
              <span className="sm-stat-label">Total</span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="sm-alert sm-alert--error" role="alert">
            <span className="sm-mi" style={{fontSize: 18, color: "#b91c1c"}} aria-hidden="true">error_outline</span>
            <div>
              <div className="sm-alert-title">Something went wrong</div>
              <div className="sm-alert-text">{error}</div>
            </div>
          </div>
        )}

        {/* ── Section Header ── */}
        {!loading && matches.length > 0 && (
          <div className="sm-section-head">
            <h2 className="sm-section-title">MATCHES</h2>
            <span className="sm-section-count">{matches.length}</span>
          </div>
        )}

        {/* ── Content ── */}
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
                  🏟️
                </div>
                <div className="sm-empty-title">The Arena is Empty</div>
                <div className="sm-empty-text">
                  No matches scheduled right now. Check back soon for upcoming contests.
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
                  participated={m.participated}
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

        {/* ── Profile Sheet ── */}
        <div className={`sm-sheet ${profileOpen ? "open" : ""}`} ref={sheetRef}>
          <div className="sm-sheet-handle" />

          <div className="sm-sheet-head">
            <div className="sm-sheet-avatar">{getInitials(user?.name)}</div>

            <div className="sm-sheet-meta">
              <div className="sm-sheet-name">{user?.name || "User"}</div>
              <div className="sm-sheet-email">{user?.phone || "-"}</div>
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
            Sign Out
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
    winner: m.winner || null,
    isResultPublished: m.isResultPublished || false,
    participated: m.participated || false,
  };
}
