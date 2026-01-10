import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminFetchQuestionsByQuiz } from "../../services/adminQuiz.service";
import { adminSetCorrectAnswers } from "../../services/adminAnswer.service";
import "../../styles/admin-set-answers.css";

export default function AdminSetAnswers() {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answersMap, setAnswersMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [matchId]);

  const load = async () => {
    try {
      const matchesData = await adminFetchMatches();
      const list = Array.isArray(matchesData)
        ? matchesData
        : matchesData.matches || [];

      const found = list.find((m) => (m._id || m.id) === matchId);
      setMatch(found || null);

      const storedQuizId = sessionStorage.getItem(`quiz_${matchId}`);
      if (!storedQuizId) return;

      setQuizId(storedQuizId);

      const qData = await adminFetchQuestionsByQuiz(storedQuizId);
      const sorted = [...(qData.questions || qData)].sort(
        (a, b) => a.order - b.order
      );

      setQuestions(sorted);

      const init = {};
      sorted.forEach((q) => {
        init[q._id || q.id] = {
          correctOptionIndex: undefined,
          points: q.points ?? 0,
        };
      });
      setAnswersMap(init);
    } catch (e) {
      setError("Failed to load match / quiz data");
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = match?.status === "COMPLETED";

  const allAnswered = useMemo(() => {
    return questions.every(
      (q) => answersMap[q._id || q.id]?.correctOptionIndex !== undefined
    );
  }, [questions, answersMap]);

  const onSave = async () => {
    setError("");
    setSuccess("");

    if (!allAnswered) return setError("Answer all questions first");

    try {
      setSaving(true);
      await adminSetCorrectAnswers(quizId, {
        answers: questions.map((q) => {
          const qid = q._id || q.id;
          return {
            questionId: qid,
            correctOptionIndex: answersMap[qid].correctOptionIndex,
            points: answersMap[qid].points,
          };
        }),
      });
      setSuccess("Correct answers saved successfully");
    } catch {
      setError("Failed to save answers");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <Link to="/admin/matches" className="back-link" style={{marginBottom:"30px"}}>
          ← Back to Matches
        </Link>
        <header className="admin-header">
          <h1>Set Correct Answers</h1>
          <div className="meta">
            {/* <span>
              Match: <code>{matchId}</code>
            </span> */}
            <span>
              Status: <b>{match?.status || "UNKNOWN"}</b>
            </span>
            {/* <span>
              Quiz: <code>{quizId || "N/A"}</code>
            </span> */}
          </div>
        </header>

        {loading && <div className="info-box">Loading…</div>}
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        {!loading && quizId && !isCompleted && (
          <div className="lock-box">
            Match must be <b>COMPLETED</b> before setting answers.
          </div>
        )}

        {!loading && isCompleted && questions.length > 0 && (
          <>
            {questions.map((q, i) => {
              const qid = q._id || q.id;
              return (
                <div key={qid} className="question-card">
                  <div className="q-title">
                    {i + 1}. {q.questionText}
                  </div>

                  <div className="options">
                    {q.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={`q_${qid}`}
                          checked={answersMap[qid]?.correctOptionIndex === idx}
                          onChange={() =>
                            setAnswersMap((p) => ({
                              ...p,
                              [qid]: {
                                ...p[qid],
                                correctOptionIndex: idx,
                              },
                            }))
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  <div className="points">
                    Points
                    <input
                      type="number"
                      value={answersMap[qid]?.points}
                      onChange={(e) =>
                        setAnswersMap((p) => ({
                          ...p,
                          [qid]: {
                            ...p[qid],
                            points: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              );
            })}

            <button
              className="primary-btn"
              disabled={!allAnswered || saving}
              onClick={onSave}
            >
              {saving ? "Saving..." : "Save Correct Answers"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
