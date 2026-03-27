import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetchMatches } from "../../services/adminMatch.service";
import { adminFetchQuestionsByQuiz, adminFetchQuizzesByMatch } from "../../services/adminQuiz.service";
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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isCompleted = match?.status === "COMPLETED";

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const matchesData = await adminFetchMatches();
      const list = Array.isArray(matchesData)
        ? matchesData
        : matchesData?.matches || [];

      const found = list.find((m) => (m._id || m.id) === matchId);
      setMatch(found || null);

      const quizzes = await adminFetchQuizzesByMatch(matchId);
      const quizList = Array.isArray(quizzes) ? quizzes : [];
      const foundQuiz = quizList[0]; // first (most recent) quiz for this match

      if (!foundQuiz) {
        setQuizId(null);
        setQuestions([]);
        setAnswersMap({});
        return;
      }

      const fetchedQuizId = foundQuiz._id || foundQuiz.id;
      setQuizId(fetchedQuizId);

      const qData = await adminFetchQuestionsByQuiz(fetchedQuizId);
      const raw = Array.isArray(qData) ? qData : qData?.questions || [];
      const sorted = [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setQuestions(sorted);

      const init = {};
      sorted.forEach((q) => {
        const qid = q._id || q.id;
        init[qid] = {
          correctOptionIndex: q.correctOptionIndex != null ? q.correctOptionIndex : undefined,
          points: q.points ?? 0,
        };
      });
      setAnswersMap(init);
    } catch (e) {
      setErrorMsg("Failed to load match / quiz data");
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => {
      const qid = q._id || q.id;
      return answersMap[qid]?.correctOptionIndex !== undefined;
    });
  }, [questions, answersMap]);

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!quizId) return setErrorMsg("Quiz not found for this match.");
    if (!allAnswered) return setErrorMsg("Answer all questions first.");

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

      setSuccessMsg("Correct answers saved successfully.");
    } catch (e) {
      setErrorMsg("Failed to save answers");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-sa-page">
      <div className="adm-sa-wrap">
        <Link to="/admin/matches" className="adm-sa-back">
          ← Back to Matches
        </Link>

        <header className="adm-sa-header">
          <div className="adm-sa-title-block">
            <h1 className="adm-sa-title">Set Correct Answers</h1>
            <div className="adm-sa-subtitle">
              Set correct option + points per question
            </div>
          </div>

          <div className="adm-sa-meta">
            <div className="adm-sa-chip">
              Status: <b>{match?.status || "UNKNOWN"}</b>
            </div>
          </div>
        </header>

        {loading && <div className="adm-sa-info">Loading…</div>}
        {!loading && errorMsg && <div className="adm-sa-error">{errorMsg}</div>}
        {!loading && successMsg && (
          <div className="adm-sa-success" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span>{successMsg}</span>
            <Link to={`/admin/matches/${matchId}/score`} style={{ fontWeight: 700, fontSize: 13, color: "#059669", whiteSpace: "nowrap", textDecoration: "none" }}>
              Score Quiz →
            </Link>
          </div>
        )}

        {!loading && !quizId && (
          <div className="adm-sa-lock">
            No quiz found for this match. Create a quiz first.
          </div>
        )}

        {!loading && quizId && !isCompleted && (
          <div className="adm-sa-lock">
            Match must be <b>COMPLETED</b> before setting answers.
          </div>
        )}

        {!loading && isCompleted && questions.length === 0 && (
          <div className="adm-sa-info">No questions found for this quiz.</div>
        )}

        {!loading && isCompleted && questions.length > 0 && (
          <>
            <div className="adm-sa-list">
              {questions.map((q, index) => {
                const qid = q._id || q.id;
                const selectedIdx = answersMap[qid]?.correctOptionIndex;

                return (
                  <div key={qid} className="adm-sa-card">
                    <div className="adm-sa-qhead">
                      <div className="adm-sa-qno">{index + 1}</div>
                      <div className="adm-sa-qtext">{q.questionText}</div>
                    </div>

                    <div className="adm-sa-options">
                      {q.options.map((opt, idx) => {
                        const checked = selectedIdx === idx;

                        return (
                          <label
                            key={idx}
                            className={`adm-sa-opt ${checked ? "is-on" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`q_${qid}`}
                              checked={checked}
                              onChange={() =>
                                setAnswersMap((prev) => ({
                                  ...prev,
                                  [qid]: {
                                    ...prev[qid],
                                    correctOptionIndex: idx,
                                  },
                                }))
                              }
                            />
                            <span className="adm-sa-opt-dot" />
                            <span className="adm-sa-opt-text">{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="adm-sa-points">
                      <label className="adm-sa-label">Points</label>
                      <input
                        className="adm-sa-input"
                        type="number"
                        value={answersMap[qid]?.points ?? 0}
                        onChange={(e) =>
                          setAnswersMap((prev) => ({
                            ...prev,
                            [qid]: {
                              ...prev[qid],
                              points: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="adm-sa-save"
              disabled={!allAnswered || saving}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save Correct Answers"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
