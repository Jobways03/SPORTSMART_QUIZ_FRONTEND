import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserResults } from "../services/result.service";
import { useUser } from "../context/UserContext";
import "../styles/result.css";

export default function Results() {
  const { quizId } = useParams();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notParticipated, setNotParticipated] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    setNotParticipated(false);

    try {
      const res = await fetchUserResults({
        quizId,
        userId: user.userId,
      });

      setData(res);
    } catch (e) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message;

      // ❌ User did not participate
      if (
        status === 404 &&
        message === "You did not participate in this quiz"
      ) {
        setNotParticipated(true);
        return;
      }

      // ⏳ Results not published
      if (e?.response?.data?.published === false) {
        setData({ published: false });
        return;
      }

      setError(message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line
  }, [quizId, user?.userId]);

  return (
    <div className="results-page">
      <Link to="/matches" className="results-back-link">
        ← Back to Matches
      </Link>

      <div className="results-header">
        <h2>Quiz Results</h2>
      </div>

      {/* LOADING */}
      {loading && <div className="results-loading">Loading results…</div>}

      {/* ERROR */}
      {!loading && error && (
        <div className="results-error">
          <b>Error</b>
          <div>{error}</div>
        </div>
      )}

      {/* USER DID NOT PARTICIPATE */}
      {!loading && notParticipated && (
        <div className="results-not-participated">
          <h3>🚫 You did not participate in this quiz</h3>
          <p>Results are available only for users who submitted answers.</p>
        </div>
      )}

      {/* RESULTS NOT PUBLISHED */}
      {!loading && data?.published === false && (
        <div className="results-not-published">
          <h3>⏳ Results Not Published Yet</h3>
          <p>Please check back once the admin publishes the results.</p>
        </div>
      )}

      {/* RESULTS PUBLISHED */}
      {!loading && data?.published === true && (
        <>
          {/* SCORE SUMMARY */}
          <div className="score-card">
            <div className="score-label">Your Score</div>
            <div className="score-value">{data.score}</div>
          </div>

          {/* BREAKDOWN */}
          <div className="breakdown-header">
            <h3>Answer Breakdown</h3>
          </div>

          <div className="breakdown-cards">
            {data.breakdown.map((b, idx) => {
              const isCorrect = b.yourAnswer === b.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`breakdown-card ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="question-number">{idx + 1}</div>
                  <div className="question-text">{b.questionText}</div>

                  <div className="answer-row your-answer">
                    <span>Your Answer</span>
                    <b
                      style={{
                        color: isCorrect ? "#16a34a" : "#ef4444",
                      }}
                    >
                      {b.yourAnswer}
                    </b>
                  </div>

                  {!isCorrect && (
                    <div className="answer-row correct-answer">
                      <span>Correct Answer</span>
                      <b style={{ color: "#16a34a" }}>{b.correctAnswer}</b>
                    </div>
                  )}

                  <div className="points-earned">
                    <span>Points Earned</span>
                    <b>{b.pointsEarned}</b>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="results-footer">
            <Link to={`/leaderboard/${quizId}`} className="leaderboard-btn">
              View Leaderboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
