import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  // Get top 3 for podium
  const topThree = list.slice(0, 3);

  return (
    <div className="leaderboard-page">
      <Link to="/matches" className="leaderboard-back-link">
        ← Back to Matches
      </Link>

      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="trophy-icon">🏆</div>
      </div>

      {loading && (
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>
          Loading leaderboard…
        </div>
      )}

      {!loading && error && <div className="leaderboard-error">{error}</div>}

      {!loading && !error && rank !== null && (
        <div className="rank-card">
          Your Rank <b>#{rank ?? "-"}</b>
        </div>
      )}

      {/* Podium for top 3 */}
      {!loading && !error && topThree.length > 0 && (
        <div className="podium-container">
          {topThree.map((u, index) => {
            const podiumClass = `podium-item podium-${index + 1}`;
            const medal = getMedalStyle(u.rank);

            return (
              <div key={u.rank} className={podiumClass}>
                <div className="podium-content">
                  <div className="podium-rank">{medal.emoji}</div>
                  <div className="podium-name">{u.name}</div>
                  <div className="podium-score">{u.score} pts</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard Table */}
      {!loading && !error && list.length > 0 && (
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="table-header-rank">Rank</div>
            <div className="table-header-user">Player</div>
            <div className="table-header-score">Score</div>
          </div>

          <div className="table-body">
            {list.map((u, index) => {
              const isMe = u.phone === user.phone;
              const rowClass = `leaderboard-row ${isMe ? "user-row" : ""}`;
              const medal = getMedalStyle(u.rank);

              return (
                <div
                  key={u.rank || index}
                  className={rowClass}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`rank-column ${medal.className}`}>
                    {medal.emoji}
                  </div>

                  <div className="user-column">
                    <div className="user-name">{u.name}</div>
                    {/* <div className="user-phone">{u.phone}</div> */}
                  </div>

                  <div className="score-column">{u.score}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && list.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Leaderboard Data</h3>
          <p>Be the first to participate in the quiz!</p>
        </div>
      )}
    </div>
  );
}
