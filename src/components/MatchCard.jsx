import React, { useMemo } from "react";
import { getMatchStatus } from "../utils/time";
import "../styles/matchcard.css";

export default function MatchCard({ match, onViewQuiz }) {
  const baseStatus = getMatchStatus(match); // expected: UPCOMING | LIVE | COMPLETED | CANCELLED

  const startDate = useMemo(
    () => new Date(match?.startTime),
    [match?.startTime],
  );
  const now = useMemo(() => new Date(), []);

  const hasValidStart =
    startDate instanceof Date && !isNaN(startDate.getTime());
  const isBeforeStart = hasValidStart
    ? now.getTime() < startDate.getTime()
    : true;

  // UI Phase (Upcoming → Open → Locked → Results)
  const uiStatus = useMemo(() => {
    if (baseStatus === "CANCELLED") return "CANCELLED";
    if (baseStatus === "COMPLETED") return "COMPLETED"; // Results phase
    if (baseStatus === "UPCOMING") return "UPCOMING";
    if (baseStatus === "LIVE") return isBeforeStart ? "OPEN" : "LOCKED";
    return "UPCOMING";
  }, [baseStatus, isBeforeStart]);

  const isDisabled =
    uiStatus === "UPCOMING" ||
    uiStatus === "LOCKED" ||
    uiStatus === "CANCELLED";

  const formatDateTime12 = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  const badgeText =
    uiStatus === "OPEN" ? "OPEN" : uiStatus === "LOCKED" ? "LOCKED" : uiStatus; // UPCOMING / COMPLETED / CANCELLED

  const buttonText =
    uiStatus === "CANCELLED"
      ? "Quiz Cancelled"
      : uiStatus === "UPCOMING"
        ? "Starts Soon"
        : uiStatus === "OPEN"
          ? "Play Now"
          : uiStatus === "LOCKED"
            ? "Closed"
            : uiStatus === "COMPLETED"
              ? "View Results"
              : "View Quiz";

  const buttonIcon =
    uiStatus === "OPEN"
      ? "play_arrow"
      : uiStatus === "COMPLETED"
        ? "fact_check"
        : uiStatus === "UPCOMING"
          ? "schedule"
          : uiStatus === "LOCKED"
            ? "lock"
            : uiStatus === "CANCELLED"
              ? "cancel"
              : "lock";

  const buttonTitle =
    uiStatus === "CANCELLED"
      ? "Quiz cancelled"
      : uiStatus === "UPCOMING"
        ? "Starts soon"
        : uiStatus === "LOCKED"
          ? "Closed (match started)"
          : uiStatus === "OPEN"
            ? "Play now"
            : uiStatus === "COMPLETED"
              ? "View results"
              : "";

  return (
    <article className="mc-card">
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

          <span className={`mc-badge mc-badge--${uiStatus.toLowerCase()}`}>
            {badgeText}
          </span>
        </div>

        <div className="mc-meta">
          <div className="mc-row">
            <span className="mc-k">Start Time</span>
            <span className="mc-v">{formatDateTime12(match.startTime)}</span>
          </div>
        </div>

        <button
          className={`mc-btn ${isDisabled ? "is-disabled" : ""}`}
          onClick={onViewQuiz}
          disabled={isDisabled}
          title={buttonTitle}
        >
          <span className="mc-btn-mi" aria-hidden="true">
            {buttonIcon}
          </span>
          {buttonText}
        </button>
      </div>
    </article>
  );
}
