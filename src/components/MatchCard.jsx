import React from "react";
import { formatDateTime, getMatchStatus } from "../utils/time";
import "../styles/matchcard.css";

export default function MatchCard({ match, onViewQuiz }) {
  const status = getMatchStatus(match);

  const isDisabled = status === "UPCOMING" || status === "CANCELLED";

  const getSportIcon = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("cricket")) return "🏏";
    if (t.includes("football") || t.includes("soccer")) return "⚽";
    if (t.includes("basketball")) return "🏀";
    if (t.includes("tennis")) return "🎾";
    return "🏅";
  };

  return (
    <article className="mc-card">
      {/* Cover */}
      {/* Cover */}
      {match.coverImage ? (
        <div className="mc-cover">
          <img
            src={match.coverImage}
            alt={match.title}
            className="mc-cover-img"
            loading="lazy"
          />
          <div className="mc-cover-overlay" aria-hidden="true" />
        </div>
      ) : (
        <div className="mc-cover mc-cover--fallback" aria-hidden="true">
          <div className="mc-fallback-pattern" />
          {/* <div className="mc-fallback-content">
            <div className="mc-fallback-emoji">{getSportIcon(match.title)}</div>
            <div className="mc-fallback-title">
              {(match.title || "Match").slice(0, 28)}
            </div>
            <div className="mc-fallback-sub">
              {match.tournament || "Tournament"}
            </div>
          </div> */}
        </div>
      )}

      {/* Body */}
      <div className="mc-body">
        <div className="mc-top">
          <div className="mc-titleWrap">
            <h3 className="mc-title" title={match.title}>
              {match.title}
            </h3>
            <div className="mc-sub">
              <span className="mc-mi" aria-hidden="true">
                emoji_events
              </span>
              <span className="mc-tournament">{match.tournament || "-"}</span>
            </div>
          </div>

          <span className={`mc-badge mc-badge--${status.toLowerCase()}`}>
            {status}
          </span>
        </div>

        <div className="mc-meta">
          <div className="mc-row">
            <span className="mc-k">Start Time</span>
            <span className="mc-v">{formatDateTime(match.startTime)}</span>
          </div>
        </div>

        <button
          className={`mc-btn ${isDisabled ? "is-disabled" : ""}`}
          onClick={onViewQuiz}
          disabled={isDisabled}
          title={
            status === "CANCELLED"
              ? "Quiz cancelled"
              : status === "UPCOMING"
                ? "Quiz available after match starts"
                : ""
          }
        >
          <span className="mc-btn-mi" aria-hidden="true">
            {status === "LIVE"
              ? "play_arrow"
              : status === "COMPLETED"
                ? "fact_check"
                : "lock"}
          </span>

          {status === "CANCELLED"
            ? "Quiz Cancelled"
            : status === "UPCOMING"
              ? "Quiz Not Started"
              : "View Quiz"}
        </button>
      </div>
    </article>
  );
}
