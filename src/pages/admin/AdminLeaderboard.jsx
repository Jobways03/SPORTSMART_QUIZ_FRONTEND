import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAdminLeaderboard } from "../../services/leaderboard.service";
import "../../styles/admin-leaderboard.css";

const getInitial = (name = "") => (name.charAt(0) || "?").toUpperCase();

export default function AdminLeaderboard() {
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [list, setList]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

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

  useEffect(() => { loadLeaderboard(); }, [quizId]);

  const top3    = list.slice(0, 3);
  const restList = list.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd · 1st · 3rd

  const avatarClass = (rank) => {
    if (rank === 1) return "alb-av alb-av-1";
    if (rank === 2) return "alb-av alb-av-2";
    return "alb-av alb-av-3";
  };

  const medalOf = (rank) => ["🥇","🥈","🥉"][rank - 1] ?? `#${rank}`;

  return (
    <div className="alb-page">
      {/* background blur layer */}
      <div className="alb-bg" />

      <div className="alb-shell">

        {/* ── NAV ── */}
        <header className="alb-nav">
          <Link to="/admin/matches" className="alb-nav-back">← Matches</Link>
          <span className="alb-nav-title">Leaderboard</span>
          <button className="alb-nav-btn" onClick={loadLeaderboard} disabled={loading}>
            ↺
          </button>
        </header>

        {/* ── LOADING ── */}
        {loading && (
          <div className="alb-center">
            <div className="alb-spinner" /> Loading…
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && errorMsg && (
          <div className="alb-error">{errorMsg}</div>
        )}

        {/* ── EMPTY ── */}
        {!loading && !errorMsg && list.length === 0 && (
          <div className="alb-empty">
            <div className="alb-empty-icon">📊</div>
            <h3>No Data Yet</h3>
            <p>No responses have been scored yet.</p>
          </div>
        )}

        {!loading && !errorMsg && list.length > 0 && (
          <>
            {/* ══ DARK PODIUM HERO ══ */}
            <div className="alb-podium">
              <div className="alb-podium-label">{total} Players</div>

              <div className="alb-podium-row">
                {podiumOrder.map((u, i) => {
                  if (!u) return <div key={i} className="alb-p-slot" />;
                  const isFirst = u.rank === 1;
                  return (
                    <div
                      key={u.rank}
                      className={`alb-p-item ${isFirst ? "alb-p-first" : ""}`}
                    >
                      {isFirst && <div className="alb-crown">👑</div>}
                      <div className={avatarClass(u.rank)}>
                        {getInitial(u.name)}
                      </div>
                      <div className="alb-p-medal">{medalOf(u.rank)}</div>
                      <div className="alb-p-name">{u.name}</div>
                      <div className="alb-p-score">{u.score} pts</div>
                    </div>
                  );
                })}
              </div>

              {/* total players bar */}
              <div className="alb-podium-foot">
                <span>Total Participants</span>
                <span className="alb-podium-foot-val">{total}</span>
              </div>
            </div>

            {/* ══ FULL RANKINGS TABLE ══ */}
            <div className="alb-table">
              <div className="alb-table-head">
                <span>#</span>
                <span>Player</span>
                <span className="alb-right">Score</span>
              </div>

              {list.map((u, idx) => (
                <div
                  key={u.rank ?? idx}
                  className={`alb-row ${u.rank <= 3 ? "alb-row-top" : ""}`}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <span className="alb-row-rank">
                    {u.rank <= 3 ? medalOf(u.rank) : `#${u.rank}`}
                  </span>

                  <span className="alb-row-name">{u.name}</span>

                  <span className="alb-row-score alb-right">{u.score}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
