import React, { useMemo } from "react";
import { getMatchStatus } from "../utils/time";
import "../styles/matchcard.css";

export default function MatchCard({ match, onViewQuiz, participated }) {
  const baseStatus = getMatchStatus(match); // expected: UPCOMING | LIVE | COMPLETED | CANCELLED

  const startDate = useMemo(
    () => new Date(match?.startTime),
    [match?.startTime],
  );
  const now = new Date(); // Recomputed each render to stay current

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
    uiStatus === "CANCELLED" ||
    (uiStatus === "COMPLETED" && !participated);

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
    uiStatus === "OPEN" ? "OPEN"
    : uiStatus === "LOCKED" ? "CLOSED"
    : (uiStatus === "COMPLETED" && !participated) ? "CLOSED"
    : uiStatus; // UPCOMING / COMPLETED / CANCELLED

  const badgeClass =
    uiStatus === "COMPLETED" && !participated
      ? "mc-badge mc-badge--locked"
      : `mc-badge mc-badge--${uiStatus.toLowerCase()}`;

  const buttonText =
    uiStatus === "CANCELLED"
      ? "Cancelled"
      : uiStatus === "UPCOMING"
        ? "Coming Soon"
        : uiStatus === "OPEN"
          ? "Enter Arena"
          : uiStatus === "LOCKED"
            ? "Arena Closed"
            : uiStatus === "COMPLETED"
              ? (participated ? "View Results" : "Arena Closed")
              : "View Quiz";

  const buttonIcon =
    uiStatus === "OPEN"
      ? "play_arrow"
      : uiStatus === "COMPLETED"
        ? (participated ? "fact_check" : "lock")
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

  /* ── Winner reveal card: only after results are published AND winner photo set ── */
  const isWinnerCard = !!match.isResultPublished && !!match.winner?.photo;

  if (isWinnerCard) {
    const w = match.winner;
    return (
      <article className="mc-card mc-card--winner">
        {/* Winner photo as full cover background */}
        <div className="mc-cover mc-cover--winner">
          <img
            src={w.photo}
            alt={w.name}
            className="mc-cover-img"
            loading="lazy"
          />
          {/* Dark gradient overlay */}
          <div className="mc-winner-overlay" />

          {/* Top-left: WINNER badge */}
          <div className="mc-winner-left-badge">🏆 WINNER</div>

          {/* Top-right: winner name */}
          <div className="mc-winner-top-badge">
            <span>{w.name}</span>
          </div>

          {/* Bottom: won product */}
          {w.prize && (
            <div className="mc-winner-prize-badge">
              🎁 Won {w.prize}
            </div>
          )}
        </div>

        {/* Body: same structure as normal card */}
        <div className="mc-body mc-body--winner">
          <div className="mc-top">
            <div className="mc-titleWrap">
              <h3 className="mc-title" title={match.title}>{match.title}</h3>
              {match.tournament && (
                <div className="mc-sub">
                  <span className="mc-mi" aria-hidden="true">emoji_events</span>
                  <span className="mc-tournament">{match.tournament}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
              <span className={badgeClass}>{badgeText}</span>
              {participated && (
                <span className="mc-badge mc-badge--participated">Participated</span>
              )}
            </div>
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
            <span className="mc-btn-mi" aria-hidden="true">{buttonIcon}</span>
            {buttonText}
          </button>
        </div>
      </article>
    );
  }

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

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
            <span className={badgeClass}>
              {badgeText}
            </span>
            {participated && (
              <span className="mc-badge mc-badge--participated">
                Participated
              </span>
            )}
          </div>
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
