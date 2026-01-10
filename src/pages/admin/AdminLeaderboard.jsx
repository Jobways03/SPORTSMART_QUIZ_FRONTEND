import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchLeaderboard } from "../../services/leaderboard.service";

const getMedal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function AdminLeaderboard() {
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchLeaderboard(quizId);
      setList(res.leaderboard || []);
    } catch (e) {
      setError("Leaderboard not available yet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [quizId]);

  return (
    <div className="admin-leaderboard-page">
      <Link to="/admin/matches" className="back-link">
        ← Back to Matches
      </Link>

      <div className="admin-leaderboard-header">
        <h1>Leaderboard</h1>
        <span className="trophy">🏆</span>
      </div>

      {loading && <div className="info-box">Loading leaderboard…</div>}

      {!loading && error && <div className="error-box">{error}</div>}

      {!loading && !error && list.length === 0 && (
        <div className="info-box">No leaderboard data found</div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="leaderboard-table">
          <div className="table-header">
            <div>Rank</div>
            <div>Player</div>
            <div>Score</div>
          </div>

          {list.map((u, index) => (
            <div
              key={u.rank || index}
              className="table-row"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="rank-col">{getMedal(u.rank)}</div>
              <div className="name-col">{u.name}</div>
              <div className="score-col">{u.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
