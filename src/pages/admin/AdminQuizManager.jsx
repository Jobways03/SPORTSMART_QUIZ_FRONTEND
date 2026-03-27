import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  adminCreateQuiz,
  adminFetchQuestionsByQuiz,
  adminCreateQuestion,
  adminFetchQuizzesByMatch,
  adminUpdateQuestion,
  adminDeleteQuestion,
} from "../../services/adminQuiz.service";
import "../../styles/admin-quiz.css";

const DEFAULT_POINTS = 5;
const DEFAULT_OPTIONS_COUNT = 4;

export default function AdminQuizManager() {
  const { matchId } = useParams();

  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(Array(DEFAULT_OPTIONS_COUNT).fill(""));
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [order, setOrder] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  /* ---------------- LOAD EXISTING QUIZ ---------------- */
  useEffect(() => {
    const loadExistingQuiz = async () => {
      try {
        const quizzes = await adminFetchQuizzesByMatch(matchId);
        const quizList = Array.isArray(quizzes) ? quizzes : [];
        const existingQuiz = quizList[0];
        if (existingQuiz) {
          const id = existingQuiz._id || existingQuiz.id;
          setQuizId(id);
          loadQuestions(id);
        }
      } catch {
        // no existing quiz, user can create one
      }
    };
    loadExistingQuiz();
  }, [matchId]);

  const loadQuestions = async (qid) => {
    const data = await adminFetchQuestionsByQuiz(qid);
    setQuestions(Array.isArray(data) ? data : data.questions || []);
  };

  /* ---------------- CREATE QUIZ ---------------- */
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setError("");

    if (!quizTitle.trim()) return setError("Quiz title is required");

    try {
      const data = await adminCreateQuiz({
        matchId,
        title: quizTitle.trim(),
        description: quizDesc.trim(),
      });

      const id = data._id || data.id;
      setQuizId(id);
      setQuizTitle("");
      setQuizDesc("");
    } catch {
      setError("Quiz already exists for this match");
    }
  };

  /* ---------------- ADD QUESTION ---------------- */
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError("");

    if (!questionText.trim()) return setError("Question text is required");

    if (options.some((o) => !o.trim()))
      return setError("All 4 options are required");

    await adminCreateQuestion({
      quizId,
      questionText: questionText.trim(),
      options,
      points: Number(points),
      order: Number(order),
    });

    setQuestionText("");
    setOptions(Array(DEFAULT_OPTIONS_COUNT).fill(""));
    setPoints(DEFAULT_POINTS);
    setOrder(order + 1);

    await loadQuestions(quizId);
  };

  /* ---------------- START EDITING ---------------- */
  const handleStartEdit = (q) => {
    const id = q._id || q.id;
    setEditingId(id);
    setQuestionText(q.questionText);
    setOptions([...q.options]);
    setPoints(q.points);
    setOrder(q.order);
    setError("");
  };

  /* ---------------- CANCEL EDIT ---------------- */
  const handleCancelEdit = () => {
    setEditingId(null);
    setQuestionText("");
    setOptions(Array(DEFAULT_OPTIONS_COUNT).fill(""));
    setPoints(DEFAULT_POINTS);
    setOrder(questions.length + 1);
  };

  /* ---------------- UPDATE QUESTION ---------------- */
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setError("");

    if (!questionText.trim()) return setError("Question text is required");
    if (options.some((o) => !o.trim()))
      return setError("All 4 options are required");

    try {
      await adminUpdateQuestion(editingId, {
        questionText: questionText.trim(),
        options,
        points: Number(points),
        order: Number(order),
      });

      setEditingId(null);
      setQuestionText("");
      setOptions(Array(DEFAULT_OPTIONS_COUNT).fill(""));
      setPoints(DEFAULT_POINTS);
      setOrder(questions.length + 1);

      await loadQuestions(quizId);
    } catch {
      setError("Failed to update question");
    }
  };

  /* ---------------- DELETE QUESTION ---------------- */
  const handleDeleteQuestion = async (questionId) => {
    try {
      await adminDeleteQuestion(questionId);
      setDeleteConfirmId(null);
      await loadQuestions(quizId);
    } catch {
      setError("Failed to delete question");
    }
  };

  return (
    <div className="admin-quiz-page">
      <div className="admin-quiz-container">
        <Link to="/admin/matches" className="admin-back-link">
          ← Back to Matches
        </Link>

        <header className="admin-quiz-header">
          <h1>Quiz Management</h1>
          <span>
            Match ID: <code>{matchId}</code>
          </span>
        </header>

        {error && <div className="admin-error-box">{error}</div>}

        {/* ================= CREATE QUIZ ================= */}
        {!quizId && (
          <section className="admin-card">
            <h2>Create Quiz</h2>
            <form className="admin-form-stack" onSubmit={handleCreateQuiz}>
              <input
                placeholder="Quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
              <textarea
                placeholder="Quiz description (optional)"
                value={quizDesc}
                onChange={(e) => setQuizDesc(e.target.value)}
              />
              <button className="admin-btn-primary">Create Quiz</button>
            </form>
          </section>
        )}

        {/* ================= ADD QUESTIONS ================= */}
        {quizId && (
          <>
            <section className="admin-card">
              <h2>{editingId ? "Edit Question" : "Add Question"}</h2>

              <form
                className="admin-form-stack"
                onSubmit={editingId ? handleUpdateQuestion : handleAddQuestion}
              >
                <input
                  placeholder="Question text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />

                <div className="admin-options-grid">
                  {options.map((opt, i) => (
                    <input
                      key={i}
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[i] = e.target.value;
                        setOptions(copy);
                      }}
                    />
                  ))}
                </div>

                <div className="admin-inline-fields">
                  <div className="admin-field">
                    <label>Points</label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-inline-fields">
                  <button type="submit" className="admin-btn-primary">
                    {editingId ? "Update Question" : "Add Question"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* ================= NEXT STEP ================= */}
            {questions.length > 0 && (
              <section className="admin-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2638" }}>Ready to set correct answers?</div>
                  <div style={{ fontSize: 12, color: "#6b7c8f", marginTop: 2 }}>Mark the correct option for each question after the match.</div>
                </div>
                <Link to={`/admin/matches/${matchId}/answers`} className="admin-btn-primary" style={{ whiteSpace: "nowrap", textDecoration: "none" }}>
                  Set Answers →
                </Link>
              </section>
            )}

            {/* ================= QUESTIONS LIST ================= */}
            <section className="admin-card">
              <h2>Questions</h2>

              {questions.length === 0 ? (
                <div className="admin-info-box">No questions added</div>
              ) : (
                questions
                  .sort((a, b) => a.order - b.order)
                  .map((q) => {
                    const id = q._id || q.id;
                    return (
                      <div key={id} className="admin-question-row">
                        <div className="admin-q-title">
                          {q.order}. {q.questionText}
                        </div>
                        <div className="admin-q-options">
                          {q.options.join(" • ")}
                        </div>
                        <div className="admin-q-meta">
                          <span className="admin-q-points">
                            Points: {q.points}
                          </span>
                          <div className="admin-q-actions">
                            <button
                              className="admin-btn-edit"
                              onClick={() => handleStartEdit(q)}
                            >
                              Edit
                            </button>
                            {deleteConfirmId === id ? (
                              <>
                                <button
                                  className="admin-btn-danger"
                                  onClick={() => handleDeleteQuestion(id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="admin-btn-secondary"
                                  onClick={() => setDeleteConfirmId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="admin-btn-danger"
                                onClick={() => setDeleteConfirmId(id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
