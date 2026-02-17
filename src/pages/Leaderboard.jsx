import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchFullLeaderboard } from "../services/leaderboard.service";
import { useUser } from "../context/UserContext";
import "../styles/leader.css";

const getMedalStyle = (rank) => {
  if (rank === 1) return { emoji: "\u{1F947}", className: "rank-1" };
  if (rank === 2) return { emoji: "\u{1F948}", className: "rank-2" };
  if (rank === 3) return { emoji: "\u{1F949}", className: "rank-3" };
  return { emoji: `#${rank}`, className: "" };
};

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
    setLoading(true);
    setError("");

    try {
      const data = await fetchFullLeaderboard({
        quizId,
        userId: user.userId,
      });

      setList(data.leaderboard || []);
      setMyEntry(data.myEntry || null);
      setTotalPlayers(data.totalPlayers || 0);
    } catch {
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

  // Check if user is already in the top 10 list
  const isUserInTop10 = useMemo(() => {
    if (!myEntry) return false;
    return list.some(
      (u) => String(u.userId) === String(myEntry.userId)
    );
  }, [list, myEntry]);

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
              {loading
                ? "Loading\u2026"
                : `Top 10 of ${totalPlayers} players`}
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
              Loading leaderboard\u2026
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
        {!loading && !error && myEntry && (
          <div className="l-rankCard">
            <div className="l-rankLeft">
              <div className="l-rankLabel">Your Rank</div>
              <div className="l-rankValue">#{myEntry.rank}</div>
            </div>
            <div className="l-rankRight">
              <div className="l-rankScore">{myEntry.score} pts</div>
              <div className="l-rankChip">
                <span className="l-mi" aria-hidden="true">
                  emoji_events
                </span>
                {myEntry.rank <= 3
                  ? `Top ${myEntry.rank}`
                  : myEntry.rank <= 10
                    ? "Top 10"
                    : `of ${totalPlayers}`}
              </div>
            </div>
          </div>
        )}

        {/* Podium */}
        {!loading && !error && topThree.length > 0 && (
          <section className="l-podium">
            <div className="l-podiumHead">
              <div className="l-podiumTitle">
                <span className="l-trophy" aria-hidden="true">
                  {"\u{1F3C6}"}
                </span>
                Top Players
              </div>
              <div className="l-podiumSub">Podium (Top 3)</div>
            </div>

            <div className="l-podiumGrid">
              {topThree.map((u, idx) => {
                const medal = getMedalStyle(u.rank);
                const isMe =
                  myEntry && String(u.userId) === String(myEntry.userId);
                return (
                  <div
                    key={u.rank || idx}
                    className={`l-podiumCard p-${idx + 1}`}
                  >
                    <div className="l-podiumBadge">{medal.emoji}</div>
                    <div className="l-podiumName" title={u.name}>
                      {u.name}
                      {isMe && <span className="l-meTag">You</span>}
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
                const isMe =
                  myEntry && String(u.userId) === String(myEntry.userId);
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

              {/* Show user's row separately if outside top 10 */}
              {myEntry && !isUserInTop10 && (
                <>
                  <div className="l-tr l-tr--gap">
                    <div className="l-td l-rank">...</div>
                    <div className="l-td l-user" />
                    <div className="l-td l-score l-right" />
                  </div>
                  <div
                    className="l-tr is-me"
                    style={{ animationDelay: "0.44s" }}
                  >
                    <div className="l-td l-rank">#{myEntry.rank}</div>
                    <div className="l-td l-user">
                      <div className="l-name">
                        {myEntry.name}
                        <span className="l-meTag">You</span>
                      </div>
                    </div>
                    <div className="l-td l-score l-right">
                      {myEntry.score}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Empty */}
        {!loading && !error && list.length === 0 && (
          <div className="l-state">
            <div className="l-stateCard">
              <div className="l-stateIcon" aria-hidden="true">
                {"\u{1F4CA}"}
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
