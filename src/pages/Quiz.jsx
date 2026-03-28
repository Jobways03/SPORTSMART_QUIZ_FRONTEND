import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchActiveQuiz } from "../services/quiz.service";
import {
  checkSubmissionStatus,
  submitQuiz,
} from "../services/response.service";
import QuestionCard from "../components/QuestionCard";
import { useUser } from "../context/UserContext";
import "../styles/quiz.css";

export default function Quiz() {
  const { matchId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [answersMap, setAnswersMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadQuiz = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await fetchActiveQuiz(matchId);

      const matchStatus = data?.match?.status;

      // 1) MATCH COMPLETED → ALWAYS ALLOW RESULTS
      if (matchStatus === "COMPLETED") {
        setQuiz({
          quizId: data.quizId,
          isLocked: false,
          completed: true,
          match: data.match,
          questions: [],
        });

        if (user?.userId) {
          const status = await checkSubmissionStatus({
            quizId: data.quizId,
            userId: user.userId,
          });
          setSubmitted(Boolean(status?.submitted));
        }
        return;
      }

      // 2) QUIZ LOCKED (MATCH NOT COMPLETED)
      if (data?.isLocked === true) {
        setQuiz({ isLocked: true });
        return;
      }

      // 3) ACTIVE QUIZ
      const quizData = {
        quizId: data.quizId,
        isLocked: false,
        completed: false,
        match: data.match,
        questions: data.questions || [],
      };

      setQuiz(quizData);

      if (quizData.quizId && user?.userId) {
        const status = await checkSubmissionStatus({
          quizId: quizData.quizId,
          userId: user.userId,
        });
        setSubmitted(Boolean(status?.submitted));
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load quiz.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { document.title = "Quiz | Sports Arena"; }, []);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const questions = useMemo(() => {
    if (!quiz?.questions) return [];
    return [...quiz.questions].sort((a, b) => a.order - b.order);
  }, [quiz]);

  const onSelect = (questionId, optionIndex) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => answersMap[q._id || q.id] !== undefined);
  }, [questions, answersMap]);

  const onSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!quiz?.quizId) return;
    if (!user?.userId) return setError("User not logged in.");
    if (!allAnswered)
      return setError("Please answer all questions before submitting.");

    const payload = {
      quizId: quiz.quizId,
      matchId,
      userId: user.userId,
      answers: questions.map((q) => ({
        questionId: q._id || q.id,
        selectedOptionIndex: answersMap[q._id || q.id],
      })),
    };

    try {
      setSubmitting(true);
      const res = await submitQuiz(payload);
      setSubmitted(true);
      setSuccessMsg(res?.message || "Responses recorded successfully");
      setTimeout(() => {
        window.open("https://sportsmart.com/", "_blank");
      }, 0);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Submission failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = useMemo(
    () => Object.keys(answersMap).length,
    [answersMap],
  );

  const progressPercentage = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((answeredCount / questions.length) * 100);
  }, [questions.length, answeredCount]);

  return (
    <div className="q-page">
      {/* Background */}
      <div className="q-bg-pattern" aria-hidden="true" />
      <div className="q-glow q-glow--tl" aria-hidden="true" />
      <div className="q-glow q-glow--br" aria-hidden="true" />

      <div className="q-shell">
        {/* Topbar */}
        <header className="q-topbar">
          <button
            type="button"
            className="q-back"
            onClick={() => navigate("/matches")}
            aria-label="Back to Matches"
            title="Back"
          >
            <span className="q-mi" aria-hidden="true">
              arrow_back
            </span>
          </button>

          <div className="q-topmeta">
            <div className="q-top-title">
              {quiz?.match?.title || "Match Quiz"}
            </div>
            <div className="q-top-sub">
              {loading
                ? "Loading…"
                : quiz?.completed
                  ? "Completed"
                  : quiz?.isLocked
                    ? "Locked"
                    : "Active"}
            </div>
          </div>

          <div className="q-top-actions">
            <button
              type="button"
              className="q-icon-btn"
              onClick={loadQuiz}
              disabled={loading || submitting}
              aria-label="Refresh"
              title="Refresh"
            >
              <span className="q-mi" aria-hidden="true">
                refresh
              </span>
            </button>
          </div>
        </header>

        {/* Alerts */}
        {loading && (
          <div className="q-alert q-alert--info">
            <div className="q-alert-title">Loading</div>
            <div className="q-alert-text">Loading quiz…</div>
          </div>
        )}

        {error && (
          <div className="q-alert q-alert--error">
            <div className="q-alert-title">Error</div>
            <div className="q-alert-text">{error}</div>
          </div>
        )}

        {/* MATCH COMPLETED */}
        {!loading && !error && quiz?.completed && (
          <div className="q-state">
            <div className="q-state-card q-state-card--with-cover">
              {quiz.match?.coverImage && (
                <div className="q-state-cover">
                  <img src={quiz.match.coverImage} alt={quiz.match?.title} className="q-state-cover-img" />
                  <div className="q-state-cover-overlay" />
                </div>
              )}
              <div className="q-state-body">
                <div className="q-state-badge q-state-badge--done">COMPLETED</div>
                <h3 className="q-state-title">{quiz.match?.title || "Match"}</h3>
                <p className="q-state-text">
                  This match has ended. Check how you performed.
                </p>

                <Link to={`/results/${quiz.quizId}`} className="q-link-btn">
                  <span className="q-btn-mi" aria-hidden="true">
                    bar_chart
                  </span>
                  View Results
                </Link>

                <Link to={`/leaderboard/${quiz.quizId}`} className="q-link-btn q-link-btn--ghost">
                  <span className="q-btn-mi" aria-hidden="true">
                    leaderboard
                  </span>
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ LOCKED */}
        {!loading && !error && quiz?.isLocked && (
          <div className="q-state">
            <div className="q-state-card">
              <div className="q-state-badge q-state-badge--locked">LOCKED</div>
              <h3 className="q-state-title">Submissions Closed</h3>
              <p className="q-state-text">The match has started. No more entries allowed.</p>

              <button className="q-link-btn q-link-btn--ghost" onClick={() => navigate("/matches")}>
                <span className="q-btn-mi" aria-hidden="true">arrow_back</span>
                Back to Matches
              </button>
            </div>
          </div>
        )}

        {/* ALREADY SUBMITTED */}
        {!loading &&
          !error &&
          quiz &&
          !quiz.isLocked &&
          !quiz.completed &&
          submitted && (
            <div className="q-state">
              <div className="q-state-card">
                <div className="q-state-badge q-state-badge--success">SUBMITTED</div>
                <h3 className="q-state-title">You're In!</h3>

                {successMsg && <div className="q-success">{successMsg}</div>}

                <p className="q-state-text">Your predictions are locked in. Good luck!</p>

                <Link to={`/results/${quiz.quizId}`} className="q-link-btn">
                  <span className="q-btn-mi" aria-hidden="true">
                    fact_check
                  </span>
                  View Result
                </Link>

                <p className="q-note">
                  Results will be published after the match
                </p>
              </div>
            </div>
          )}

        {/* ACTIVE QUIZ */}
        {!loading &&
          !error &&
          quiz &&
          !quiz.isLocked &&
          !quiz.completed &&
          !submitted && (
            <>
              <section className="q-header">
                <h2 className="q-title">{quiz.match?.title || "Match Quiz"}</h2>
                <p className="q-subtitle">
                  Answer before the first ball is bowled.
                </p>

                {questions.length > 0 && (
                  <div className="q-progress">
                    <div className="q-progress-top">
                      <span className="q-progress-text">
                        {answeredCount} of {questions.length} answered
                      </span>
                      <span className="q-progress-text">
                        {progressPercentage}%
                      </span>
                    </div>

                    <div className="q-bar">
                      <div
                        className="q-fill"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="q-questions">
                {questions.length === 0 ? (
                  <div className="q-alert q-alert--info">
                    <div className="q-alert-title">Info</div>
                    <div className="q-alert-text">No questions added yet.</div>
                  </div>
                ) : (
                  questions.map((q, i) => (
                    <div className="q-qwrap" key={q._id || q.id}>
                      <QuestionCard
                        question={q}
                        index={i}
                        value={answersMap[q._id || q.id]}
                        onChange={(optIdx) => onSelect(q._id || q.id, optIdx)}
                        disabled={submitting}
                      />
                    </div>
                  ))
                )}
              </section>

              {questions.length > 0 && (
                <div className="q-submitbar">
                  <button
                    className="q-submit"
                    disabled={!allAnswered || submitting}
                    onClick={onSubmit}
                  >
                    {submitting ? (
                      <span className="q-loadingRow">
                        <span className="q-spinner" aria-hidden="true" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <span className="q-btn-mi" aria-hidden="true">
                          send
                        </span>
                        Submit Answers
                      </>
                    )}
                  </button>

                  {!allAnswered && (
                    <div className="q-hint">
                      Answer all questions to enable submit.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
