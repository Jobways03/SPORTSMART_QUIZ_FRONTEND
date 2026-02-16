import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchLeaderboard,
  fetchUserRank,
} from "../services/leaderboard.service";
import { useUser } from "../context/UserContext";
import "../styles/leader.css";

const getMedalStyle = (rank) => {
  if (rank === 1) return { emoji: "🥇", className: "rank-1" };
  if (rank === 2) return { emoji: "🥈", className: "rank-2" };
  if (rank === 3) return { emoji: "🥉", className: "rank-3" };
  return { emoji: `#${rank}`, className: "" };
};

export default function Leaderboard() {
  const { quizId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [rank, setRank] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [lb, ur] = await Promise.all([
        fetchLeaderboard(quizId),
        fetchUserRank({ quizId, userId: user.userId }),
      ]);

      setList(lb.leaderboard || []);
      setRank(ur.rank);
    } catch (e) {
      setError("Leaderboard not available yet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line
  }, [quizId, user?.userId]);

  const topThree = useMemo(() => list.slice(0, 3), [list]);

  return (
    <div className="l-page">
      {/* Background */}
      <div className="l-bg-pattern" aria-hidden="true" />
      <div className="l-glow l-glow--tl" aria-hidden="true" />
      <div className="l-glow l-glow--br" aria-hidden="true" />

      <div className="l-shell">
        {/* Topbar */}
        <header className="l-topbar">
          <button
            type="button"
            className="l-back"
            onClick={() => navigate("/matches")}
            aria-label="Back to Matches"
            title="Back"
          >
            <span className="l-mi" aria-hidden="true">
              arrow_back
            </span>
            Back
          </button>

          <div className="l-topmeta">
            <div className="l-top-title">Leaderboard</div>
            <div className="l-top-sub">
              {loading ? "Loading…" : `${list.length} players`}
            </div>
          </div>

          <button
            type="button"
            className="l-icon-btn"
            onClick={load}
            disabled={loading}
            aria-label="Refresh leaderboard"
            title="Refresh"
          >
            <span className="l-mi" aria-hidden="true">
              refresh
            </span>
          </button>
        </header>

        {/* Loading */}
        {loading && (
          <div className="l-alert l-alert--info">
            <div className="l-alert-title">Loading</div>
            <div className="l-alert-text">
              <span className="l-spinner" aria-hidden="true" />
              Loading leaderboard…
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="l-alert l-alert--error">
            <div className="l-alert-title">Error</div>
            <div className="l-alert-text">{error}</div>
          </div>
        )}

        {/* Your rank */}
        {!loading && !error && rank !== null && (
          <div className="l-rankCard">
            <div className="l-rankLeft">
              <div className="l-rankLabel">Your Rank</div>
              <div className="l-rankValue">#{rank ?? "-"}</div>
            </div>
            <div className="l-rankChip">
              <span className="l-mi" aria-hidden="true">
                emoji_events
              </span>
              {rank === 1
                ? "Top 1"
                : rank === 2
                  ? "Top 2"
                  : rank === 3
                    ? "Top 3"
                    : "Player"}
            </div>
          </div>
        )}

        {/* Podium */}
        {!loading && !error && topThree.length > 0 && (
          <section className="l-podium">
            <div className="l-podiumHead">
              <div className="l-podiumTitle">
                <span className="l-trophy" aria-hidden="true">
                  🏆
                </span>
                Top Players
              </div>
              <div className="l-podiumSub">Podium (Top 3)</div>
            </div>

            <div className="l-podiumGrid">
              {topThree.map((u, idx) => {
                const medal = getMedalStyle(u.rank);
                return (
                  <div
                    key={u.rank || idx}
                    className={`l-podiumCard p-${idx + 1}`}
                  >
                    <div className="l-podiumBadge">{medal.emoji}</div>
                    <div className="l-podiumName" title={u.name}>
                      {u.name}
                    </div>
                    <div className="l-podiumScore">{u.score} pts</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Table */}
        {!loading && !error && list.length > 0 && (
          <section className="l-table">
            <div className="l-th">
              <div>Rank</div>
              <div>Player</div>
              <div className="l-right">Score</div>
            </div>

            <div className="l-tb">
              {list.map((u, index) => {
                const isMe = u.phone === user.phone;
                const medal = getMedalStyle(u.rank);

                return (
                  <div
                    key={u.rank || index}
                    className={`l-tr ${isMe ? "is-me" : ""}`}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className={`l-td l-rank ${medal.className}`}>
                      {medal.emoji}
                    </div>

                    <div className="l-td l-user">
                      <div className="l-name">
                        {u.name}
                        {isMe && <span className="l-meTag">You</span>}
                      </div>
                    </div>

                    <div className="l-td l-score l-right">{u.score}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty */}
        {!loading && !error && list.length === 0 && (
          <div className="l-state">
            <div className="l-stateCard">
              <div className="l-stateIcon" aria-hidden="true">
                📊
              </div>
              <h3 className="l-stateTitle">No Leaderboard Data</h3>
              <p className="l-stateText">
                Be the first to participate in the quiz!
              </p>

              <Link to="/matches" className="l-btn">
                <span className="l-btn-mi" aria-hidden="true">
                  sports_cricket
                </span>
                Browse Matches
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
