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
    <div className="m-page">
      {/* Top App Bar */}
      <header className="m-appbar">
        <div className="m-appbar-left">
          <div className="m-title">Matches</div>
          <div className="m-subtitle">
            {loading ? "Loading…" : `${matches.length} available`}
          </div>
        </div>

        <button
          className="m-profile-btn"
          onClick={() => setProfileOpen(true)}
          aria-label="Open profile"
        >
          <span className="m-avatar">{getInitials(user?.name)}</span>
        </button>
      </header>

      {/* Error */}
      {error && (
        <div className="m-alert m-alert-error">
          <div className="m-alert-title">Error</div>
          <div className="m-alert-text">{error}</div>
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="m-skeleton-wrap">
          <div className="m-skeleton-card" />
          <div className="m-skeleton-card" />
          <div className="m-skeleton-card" />
        </div>
      ) : matches.length === 0 ? (
        <div className="m-empty">
          <div className="m-empty-card">
            <div className="m-empty-icon">🏏</div>
            <div className="m-empty-title">No matches available</div>
            <div className="m-empty-text">
              Matches will appear here when available. Try refreshing.
            </div>

            <button className="m-btn m-btn-primary" onClick={load}>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="m-grid">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onViewQuiz={() => navigate(`/quiz/${m.id}`)}
            />
          ))}
        </div>
      )}

      {/* Overlay */}
      {profileOpen && (
        <div className="m-overlay" onClick={() => setProfileOpen(false)} />
      )}

      {/* Bottom Sheet Profile */}
      <div className={`m-sheet ${profileOpen ? "open" : ""}`} ref={sheetRef}>
        <div className="m-sheet-handle" />

        <div className="m-sheet-head">
          <div className="m-sheet-avatar">{getInitials(user?.name)}</div>
          <div className="m-sheet-meta">
            <div className="m-sheet-name">{user?.name || "User"}</div>
            <div className="m-sheet-email">{user?.email || "-"}</div>
          </div>

          <button
            className="m-sheet-close"
            onClick={() => setProfileOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="m-sheet-info">
          <div className="m-sheet-row">
            <span>Phone</span>
            <b>{user?.phone || "-"}</b>
          </div>
          <div className="m-sheet-row">
            <span>User ID</span>
            <b className="m-mono">{user?.userId || "-"}</b>
          </div>
        </div>

        <button className="m-btn m-btn-danger" onClick={onLogout}>
          Logout
        </button>
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
