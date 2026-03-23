import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchUserResults } from "../services/result.service";
import { useUser } from "../context/UserContext";
import "../styles/result.css";

export default function Results() {
  const { quizId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notParticipated, setNotParticipated] = useState(false);

  const load = async () => {
    setLoading(true); setError(""); setNotParticipated(false);
    try {
      const res = await fetchUserResults({ quizId, userId: user.userId });
      setData(res);
    } catch (e) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message;
      if (status === 404 && message === "You did not participate in this quiz") { setNotParticipated(true); return; }
      if (e?.response?.data?.published === false) { setData({ published: false }); return; }
      setError(message || "Failed to fetch results");
    } finally { setLoading(false); }
  };

  useEffect(() => { document.title = "Results | Sports Arena"; }, []);

  useEffect(() => { if (user?.userId) load(); }, [quizId, user?.userId]);

  const stats = useMemo(() => {
    if (!data?.breakdown) return null;
    const total = data.breakdown.length;
    const correct = data.breakdown.filter(b => b.yourAnswer === b.correctAnswer).length;
    return { total, correct, wrong: total - correct, pct: total ? Math.round((correct / total) * 100) : 0 };
  }, [data]);

  return (
    <div className="r-page">
      <div className="r-bg-pattern" aria-hidden="true" />
      <div className="r-shell">
        <header className="r-topbar">
          <button type="button" className="r-nav-btn" onClick={() => navigate(-1)} aria-label="Back">
            <span className="r-mi">arrow_back</span>
          </button>
          <div className="r-topmeta">
            <div className="r-top-title">Results</div>
          </div>
          <button type="button" className="r-nav-btn" onClick={load} disabled={loading} aria-label="Refresh">
            <span className="r-mi">refresh</span>
          </button>
        </header>

        {loading && <div className="r-loading"><div className="r-spinner" /><span>Loading...</span></div>}
        {!loading && error && <div className="r-alert"><span className="r-mi" style={{fontSize:16}}>error_outline</span><span>{error}</span></div>}

        {!loading && notParticipated && (
          <div className="r-state"><div className="r-state-card">
            <div style={{fontSize:32,marginBottom:8}}>🚫</div>
            <h3 className="r-state-title">Not Participated</h3>
            <p className="r-state-text">You didn't submit predictions for this quiz.</p>
            <button className="r-ghost-btn" onClick={() => navigate("/matches")}><span className="r-mi">arrow_back</span>Back to Matches</button>
          </div></div>
        )}

        {!loading && data?.published === false && (
          <div className="r-state"><div className="r-state-card">
            <div style={{fontSize:32,marginBottom:8}}>⏳</div>
            <h3 className="r-state-title">Results Pending</h3>
            <p className="r-state-text">Check back once the admin publishes results.</p>
            <button className="r-ghost-btn" onClick={() => navigate("/matches")}><span className="r-mi">arrow_back</span>Back to Matches</button>
          </div></div>
        )}

        {!loading && data?.published === true && stats && (
          <>
            {/* Score */}
            <div className="r-score-card">
              <div className="r-score-left">
                <div className="r-score-ring-wrap">
                  <svg className="r-score-ring" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke={stats.pct >= 50 ? "var(--green)" : "var(--red)"} strokeWidth="6" strokeLinecap="round"
                      style={{
                        strokeDasharray: `${2*Math.PI*34}`,
                        strokeDashoffset: `${2*Math.PI*34*(1-stats.pct/100)}`,
                        transform: "rotate(-90deg)", transformOrigin: "center",
                        transition: "stroke-dashoffset 0.8s ease"
                      }}
                    />
                  </svg>
                  <div className="r-score-ring-text">
                    <span className="r-score-ring-val">{stats.pct}%</span>
                  </div>
                </div>
              </div>
              <div className="r-score-right">
                <div className="r-score-number">{data.score} <span>pts</span></div>
                <div className="r-score-meta">
                  <span className="r-score-tag green">{stats.correct} correct</span>
                  <span className="r-score-tag red">{stats.wrong} wrong</span>
                </div>
              </div>
            </div>

            <Link to={`/leaderboard/${quizId}`} className="r-lb-btn">
              <span className="r-mi">leaderboard</span>
              <span>View Leaderboard</span>
              <span className="r-mi" style={{opacity:0.4}}>chevron_right</span>
            </Link>

            <div className="r-divider">
              <span>ANSWERS</span>
              <span className="r-divider-sub">{stats.correct}/{stats.total}</span>
            </div>

            {/* Cards */}
            <div className="r-list">
              {(data.breakdown || []).map((b, idx) => {
                const ok = b.yourAnswer === b.correctAnswer;
                return (
                  <div key={idx} className="r-item" style={{animationDelay:`${idx*0.03}s`}}>
                    <div className="r-item-top">
                      <div className={`r-item-status ${ok ? "green" : "red"}`}>
                        <span className="r-mi">{ok ? "check" : "close"}</span>
                      </div>
                      <span className="r-item-q">Q{idx+1}. {b.questionText}</span>
                    </div>

                    <div className="r-item-bottom">
                      <div className="r-item-row">
                        <span className="r-item-label">Your answer</span>
                        <span className={`r-item-val ${ok ? "green" : "red"}`}>{b.yourAnswer}</span>
                      </div>
                      {!ok && (
                        <div className="r-item-row">
                          <span className="r-item-label">Correct</span>
                          <span className="r-item-val green">{b.correctAnswer}</span>
                        </div>
                      )}
                      <div className="r-item-row">
                        <span className="r-item-label">Points</span>
                        <span className="r-item-val">{b.pointsEarned}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
