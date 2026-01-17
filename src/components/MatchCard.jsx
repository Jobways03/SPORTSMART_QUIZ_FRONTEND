import React from "react";
import { formatDateTime, getMatchStatus } from "../utils/time";
import "../styles/matchcard.css";

export default function MatchCard({ match, onViewQuiz }) {
  const status = getMatchStatus(match);

  const isDisabled = status === "UPCOMING" || status === "CANCELLED";

  const getSportIcon = (title) => {
    if (title.toLowerCase().includes("cricket")) return "🏏";
    if (
      title.toLowerCase().includes("football") ||
      title.toLowerCase().includes("soccer")
    )
      return "⚽";
    if (title.toLowerCase().includes("basketball")) return "🏀";
    if (title.toLowerCase().includes("tennis")) return "🎾";
    return "🏅";
  };

  return (
    <div className="match-card">
      {/* ✅ COVER IMAGE */}
      {match.coverImage && (
        <div className="match-cover-wrapper">
          <img
            src={match.coverImage}
            alt={match.title}
            className="match-cover-image"
          />
        </div>
      )}

      {/* CARD TOP */}
      <div className="match-card-top">
        <h3 className="match-title">{match.title}</h3>
        <span className={`match-badge match-badge-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="match-meta">
        <div className="meta-item meta-tournament">
          <b>Tournament :</b> {match.tournament || "-"}
        </div>
        <div className="meta-item meta-start">
          <b>Start Time :</b> {formatDateTime(match.startTime)}
        </div>
      </div>

      <button
        className="view-quiz-btn"
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
        {status === "CANCELLED"
          ? "Quiz Cancelled"
          : status === "UPCOMING"
          ? "Quiz Not Started"
          : "View Quiz"}
      </button>
    </div>
  );
}
