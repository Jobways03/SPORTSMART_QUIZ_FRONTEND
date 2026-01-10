import React, { useEffect, useState } from "react";
import { fetchMatches } from "../services/match.service";
import { fetchUserResults } from "../services/result.service";
import MatchCard from "../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getMatchStatus } from "../utils/time";
import "../styles/matches.css";

export default function Matches() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMatches();
      const list = Array.isArray(data) ? data : data?.matches || [];

      const visible = [];

      for (const raw of list) {
        const match = normalizeMatch(raw);
        const status = getMatchStatus(match);

        // ❌ Never show cancelled
        if (status === "CANCELLED") continue;

        // ✅ Always show UPCOMING & LIVE
        if (status === "UPCOMING" || status === "LIVE") {
          visible.push(match);
          continue;
        }

        // ✅ COMPLETED → show if user participated
        if (status === "COMPLETED") {
          if (!match.quizId) {
            // SAFETY FALLBACK (do not hide silently)
            console.warn("Missing quizId for match", match.id);
            visible.push(match);
            continue;
          }

          try {
            const res = await fetchUserResults({
              quizId: match.quizId,
              userId: user.userId,
            });

            // Results published → participated
            visible.push(match);
          } catch (e) {
            const msg = e?.response?.data?.message;
            const published = e?.response?.data?.published;

            // ❌ User truly did not participate
            if (msg === "You did not participate in this quiz") {
              continue;
            }

            // ✅ Participated but results not published
            if (published === false) {
              visible.push(match);
            }
          }
        }
      }

      setMatches(visible);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load matches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line
  }, [user?.userId]);

  return (
    <div className="matches-page">
      <header className="matches-header">
        <h3 className="matches-title">Matches</h3>

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      {error && (
        <div className="error-box">
          <div>Error</div>
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="info-message">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="info-message no-matches">
          No matches available for you.
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onViewQuiz={() => navigate(`/quiz/${m.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ===========================
   NORMALIZE BACKEND RESPONSE
=========================== */
function normalizeMatch(m) {
  return {
    id: m.id || m._id,
    quizId: m.quizId, // MUST exist for completed filtering
    title: m.title,
    tournament: m.tournament,
    startTime: m.startTime,
    status: m.status,
  };
}
