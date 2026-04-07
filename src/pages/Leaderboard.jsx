import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchFullLeaderboard } from "../services/leaderboard.service";
import { useUser } from "../context/UserContext";
import "../styles/leader.css";

export default function Leaderboard() {
  const { quizId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [myEntry, setMyEntry] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await fetchFullLeaderboard({ quizId, userId: user.userId });
      setList(data.leaderboard || []);
      setMyEntry(data.myEntry || null);
      setTotalPlayers(data.totalPlayers || 0);
    } catch { setError("Leaderboard not available yet"); }
    finally { setLoading(false); }
  };

  useEffect(() => { document.title = "Leaderboard | Sports Arena"; }, []);

  useEffect(() => { if (user?.userId) load(); }, [quizId, user?.userId]);

  const isUserInTop10 = useMemo(() => {
    if (!myEntry) return false;
    return list.some(u => String(u.userId) === String(myEntry.userId));
  }, [list, myEntry]);

  const getInitial = (name = "") => (name.charAt(0) || "?").toUpperCase();

  const top3 = list.slice(0, 3);
  const restList = list.slice(3);

  return (
    <div className="l-page">
      <div className="l-bg" aria-hidden="true" />
      <div className="l-shell">
        {/* Nav */}
        <header className="l-nav">
          <button className="l-nav-btn" onClick={() => navigate(-1)}><span className="l-mi">arrow_back</span></button>
          <div className="l-nav-center">
            <div className="l-nav-title">Leaderboard</div>
          </div>
          <button className="l-nav-btn" onClick={load} disabled={loading}><span className="l-mi">refresh</span></button>
        </header>

        {loading && <div className="l-loading"><div className="l-spinner" />Loading...</div>}
        {!loading && error && <div className="l-error"><span className="l-mi" style={{fontSize:16}}>error_outline</span>{error}</div>}

        {!loading && !error && list.length > 0 && !myEntry && (
          <div className="l-empty">
            <div style={{fontSize:32,marginBottom:8}}>🚫</div>
            <h3>Not Participated</h3>
            <p>You didn't submit predictions for this quiz.</p>
            <Link to="/matches" className="l-primary-btn"><span className="l-mi">arrow_back</span> Back to Matches</Link>
          </div>
        )}

        {!loading && !error && list.length > 0 && myEntry && (
          <>
            {/* ── Dark Podium Hero ── */}
            <div className="l-podium-hero">
              <div className="l-podium-top-label">{totalPlayers} Players</div>

              <div className="l-podium-row">
                {/* 2nd */}
                {top3[1] && (
                  <div className="l-p-item l-p-2">
                    <div className="l-p-avatar l-p-avatar-2">
                      {getInitial(top3[1].name)}
                    </div>
                    <div className="l-p-medal">🥈</div>
                    <div className="l-p-name">{top3[1].name}</div>
                    <div className="l-p-score">{top3[1].score} pts</div>
                  </div>
                )}

                {/* 1st */}
                {top3[0] && (
                  <div className="l-p-item l-p-1">
                    <div className="l-p-crown">👑</div>
                    <div className="l-p-avatar l-p-avatar-1">
                      {getInitial(top3[0].name)}
                    </div>
                    <div className="l-p-medal">🥇</div>
                    <div className="l-p-name">{top3[0].name}</div>
                    <div className="l-p-score">{top3[0].score} pts</div>
                  </div>
                )}

                {/* 3rd */}
                {top3[2] && (
                  <div className="l-p-item l-p-3">
                    <div className="l-p-avatar l-p-avatar-3">
                      {getInitial(top3[2].name)}
                    </div>
                    <div className="l-p-medal">🥉</div>
                    <div className="l-p-name">{top3[2].name}</div>
                    <div className="l-p-score">{top3[2].score} pts</div>
                  </div>
                )}
              </div>

              {/* Your rank inside podium */}
              {myEntry && (
                <div className="l-podium-myrank">
                  <span>Your Rank</span>
                  <span className="l-podium-myrank-val">#{myEntry.rank} · {myEntry.score} pts</span>
                </div>
              )}
            </div>

            {/* ── Rankings ── */}
            {list.length > 0 && (
              <div className="l-rankings">
                <div className="l-rankings-head">
                  <span>#</span>
                  <span>Player</span>
                  <span>Score</span>
                </div>

                {list.map((u, idx) => {
                  const isMe = myEntry && String(u.userId) === String(myEntry.userId);
                  return (
                    <div key={u.rank || idx} className={`l-rank-row ${isMe ? "l-rank-row--me" : ""}`} style={{animationDelay:`${idx*0.03}s`}}>
                      <span className="l-rank-pos">
                        {u.rank <= 3 ? ["🥇","🥈","🥉"][u.rank-1] : u.rank}
                      </span>
                      <span className="l-rank-name">
                        {u.name}
                        {isMe && <span className="l-you">You</span>}
                      </span>
                      <span className="l-rank-score">{u.score}</span>
                    </div>
                  );
                })}

                {myEntry && !isUserInTop10 && (
                  <>
                    <div className="l-rank-row l-rank-gap">
                      <span>···</span><span /><span />
                    </div>
                    <div className="l-rank-row l-rank-row--me" style={{animationDelay:"0.4s"}}>
                      <span className="l-rank-pos">{myEntry.rank}</span>
                      <span className="l-rank-name">{myEntry.name}<span className="l-you">You</span></span>
                      <span className="l-rank-score">{myEntry.score}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="l-empty">
            <div style={{fontSize:32,marginBottom:8}}>📊</div>
            <h3>No Data Yet</h3>
            <p>Be the first to play!</p>
            <Link to="/matches" className="l-primary-btn"><span className="l-mi">sports_cricket</span> Browse Matches</Link>
          </div>
        )}
      </div>
    </div>
  );
}
