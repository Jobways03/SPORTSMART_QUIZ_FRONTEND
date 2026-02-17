import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAdminLeaderboard } from "../../services/leaderboard.service";
import "../../styles/admin-leaderboard.css";

const getRankLabel = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function AdminLeaderboard() {
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetchAdminLeaderboard(quizId);
      setList(res?.leaderboard || []);
      setTotal(res?.total || 0);
    } catch {
      setErrorMsg("Leaderboard not available yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-lb-page">
      <div className="adm-lb-wrap">
        <Link to="/admin/matches" className="adm-lb-back">
          ← Back to Matches
        </Link>

        <header className="adm-lb-header">
          <h1 className="adm-lb-title">Leaderboard</h1>
          {!loading && !errorMsg && total > 0 && (
            <span className="adm-lb-count">{total} players</span>
          )}
          <span className="adm-lb-trophy">🏆</span>
        </header>

        {loading && <div className="adm-lb-info">Loading leaderboard…</div>}

        {!loading && errorMsg && <div className="adm-lb-error">{errorMsg}</div>}

        {!loading && !errorMsg && list.length === 0 && (
          <div className="adm-lb-info">No leaderboard data found.</div>
        )}

        {!loading && !errorMsg && list.length > 0 && (
          <div className="adm-lb-table">
            <div className="adm-lb-row adm-lb-row-head">
              <div>Rank</div>
              <div>Player</div>
              <div className="align-right">Score</div>
            </div>

            {list.map((u, index) => (
              <div
                key={u.rank || index}
                className="adm-lb-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="adm-lb-rank">{getRankLabel(u.rank)}</div>

                <div className="adm-lb-player">
                  <div className="adm-lb-name">{u.name}</div>
                  <div className="adm-lb-phone">{u.phone}</div>
                </div>

                <div className="adm-lb-score align-right">{u.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
