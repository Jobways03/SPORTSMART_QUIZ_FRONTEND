import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
      console.log("QUIZ DATA:", data);

      const matchStatus = data?.match?.status;

      /* --------------------------------------------------
         1️⃣ MATCH COMPLETED → ALWAYS ALLOW RESULTS
      -------------------------------------------------- */
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

      /* --------------------------------------------------
         2️⃣ QUIZ LOCKED (MATCH NOT COMPLETED)
      -------------------------------------------------- */
      if (data?.isLocked === true) {
        setQuiz({ isLocked: true });
        return;
      }

      /* --------------------------------------------------
         3️⃣ ACTIVE QUIZ
      -------------------------------------------------- */
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
    [answersMap]
  );

  const progressPercentage = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((answeredCount / questions.length) * 100);
  }, [questions.length, answeredCount]);

  return (
    <div className="quiz-page">
      <Link to="/matches" className="back-link">
        ← Back to Matches
      </Link>

      {loading && <div className="loading-message">Loading quiz...</div>}

      {error && (
        <div className="error-box">
          <b>Error</b>
          <div>{error}</div>
        </div>
      )}

      {/* 🏁 MATCH COMPLETED */}
      {!loading && !error && quiz?.completed && (
        <div className="submitted-box">
          <h3>Match Completed 🏁</h3>

          <Link to={`/results/${quiz.quizId}`} className="view-result-btn">
            View Results
          </Link>
        </div>
      )}

      {/* 🔒 QUIZ LOCKED */}
      {!loading && !error && quiz?.isLocked && (
        <div className="locked-box">
          <h3>Quiz Locked 🔒</h3>
          <p>Submissions are closed.</p>
        </div>
      )}

      {/* ✅ ALREADY SUBMITTED */}
      {!loading &&
        !error &&
        quiz &&
        !quiz.isLocked &&
        !quiz.completed &&
        submitted && (
          <div className="submitted-box">
            <h3>Quiz Submitted ✅</h3>

            {successMsg && <div className="success-message">{successMsg}</div>}

            <Link to={`/results/${quiz.quizId}`} className="view-result-btn">
              View Result
            </Link>

            <p className="results-note">
              Results will be visible once published by admin
            </p>
          </div>
        )}

      {/* 🟢 ACTIVE QUIZ */}
      {!loading &&
        !error &&
        quiz &&
        !quiz.isLocked &&
        !quiz.completed &&
        !submitted && (
          <>
            <div className="quiz-header">
              <h2 className="quiz-title">
                {quiz.match?.title || "Match Quiz"}
              </h2>
              <p className="quiz-subtitle">
                Answer before the first ball is bowled.
              </p>

              {questions.length > 0 && (
                <div className="quiz-progress">
                  <div className="progress-text">
                    {answeredCount} of {questions.length} answered
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="progress-text">{progressPercentage}%</div>
                </div>
              )}
            </div>

            <div className="questions-container">
              {questions.length === 0 ? (
                <div className="info-message">No questions added yet.</div>
              ) : (
                questions.map((q, i) => (
                  <QuestionCard
                    key={q._id || q.id}
                    question={q}
                    index={i}
                    value={answersMap[q._id || q.id]}
                    onChange={(optIdx) => onSelect(q._id || q.id, optIdx)}
                    disabled={submitting}
                  />
                ))
              )}
            </div>

            {questions.length > 0 && (
              <button
                className="submit-btn"
                disabled={!allAnswered || submitting}
                onClick={onSubmit}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            )}
          </>
        )}
    </div>
  );
}
