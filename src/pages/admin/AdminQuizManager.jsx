import { useEffect, useState } from "react";
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
const OPTION_LABELS = ["A", "B", "C", "D"];

export default function AdminQuizManager() {
  const { matchId } = useParams();

  const [quizId, setQuizId]       = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc]   = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError]         = useState("");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions]           = useState(["", "", "", ""]);
  const [points, setPoints]             = useState(DEFAULT_POINTS);
  const [order, setOrder]               = useState(1);

  const [editingId, setEditingId]           = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving]                 = useState(false);

  /* ── Load ── */
  useEffect(() => {
    const load = async () => {
      try {
        const quizzes = await adminFetchQuizzesByMatch(matchId);
        const list = Array.isArray(quizzes) ? quizzes : [];
        const existing = list[0];
        if (existing) {
          const id = existing._id || existing.id;
          setQuizId(id);
          loadQuestions(id);
        }
      } catch { /* no quiz yet */ }
    };
    load();
  }, [matchId]);

  const loadQuestions = async (qid) => {
    const data = await adminFetchQuestionsByQuiz(qid);
    setQuestions(Array.isArray(data) ? data : data.questions || []);
  };

  const resetForm = (nextOrder = 1) => {
    setEditingId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setPoints(DEFAULT_POINTS);
    setOrder(nextOrder);
    setError("");
  };

  /* ── Create Quiz ── */
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setError("");
    if (!quizTitle.trim()) return setError("Quiz title is required");
    try {
      const data = await adminCreateQuiz({ matchId, title: quizTitle.trim(), description: quizDesc.trim() });
      setQuizId(data._id || data.id);
      setQuizTitle(""); setQuizDesc("");
    } catch {
      setError("Quiz already exists for this match");
    }
  };

  /* ── Add Question ── */
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError("");
    if (!questionText.trim()) return setError("Question text is required");
    if (options.some((o) => !o.trim())) return setError("All 4 options are required");
    try {
      setSaving(true);
      await adminCreateQuestion({ quizId, questionText: questionText.trim(), options, points: Number(points), order: Number(order) });
      resetForm(order + 1);
      await loadQuestions(quizId);
    } catch { setError("Failed to add question"); }
    finally { setSaving(false); }
  };

  /* ── Edit ── */
  const handleStartEdit = (q) => {
    setEditingId(q._id || q.id);
    setQuestionText(q.questionText);
    setOptions([...q.options]);
    setPoints(q.points);
    setOrder(q.order);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Update ── */
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setError("");
    if (!questionText.trim()) return setError("Question text is required");
    if (options.some((o) => !o.trim())) return setError("All 4 options are required");
    try {
      setSaving(true);
      await adminUpdateQuestion(editingId, { questionText: questionText.trim(), options, points: Number(points), order: Number(order) });
      resetForm(questions.length + 1);
      await loadQuestions(quizId);
    } catch { setError("Failed to update question"); }
    finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDeleteQuestion = async (questionId) => {
    try {
      await adminDeleteQuestion(questionId);
      setDeleteConfirmId(null);
      await loadQuestions(quizId);
    } catch { setError("Failed to delete question"); }
  };

  const sorted = [...questions].sort((a, b) => a.order - b.order);

  return (
    <div className="qm-page">

      {/* ── HEADER ── */}
      <div className="qm-header">
        <div className="qm-header-left">
          <div className="qm-title">Quiz Management</div>
          <div className="qm-sub">
            Match ID: <span className="qm-id-badge">{matchId}</span>
          </div>
        </div>
        <div className="qm-header-right">
          {quizId && (
            <div className="qm-count-badge">{questions.length} question{questions.length !== 1 ? "s" : ""}</div>
          )}
          <Link to="/admin/matches" className="qm-back-btn">← Matches</Link>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="qm-error">
          ⚠ {error}
          <button className="qm-error-close" onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* ── CREATE QUIZ (no quiz yet) ── */}
      {!quizId && (
        <div className="qm-card">
          <div className="qm-card-head">
            <div className="qm-card-icon">📋</div>
            <div>
              <div className="qm-card-title">Create Quiz</div>
              <div className="qm-card-sub">Set up a quiz for this match</div>
            </div>
          </div>
          <form className="qm-form" onSubmit={handleCreateQuiz}>
            <div className="qm-field">
              <label className="qm-label">Quiz Title <span className="qm-req">*</span></label>
              <input className="qm-input" placeholder="e.g. Match Prediction Quiz" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required />
            </div>
            <div className="qm-field">
              <label className="qm-label">Description <span className="qm-opt">(optional)</span></label>
              <textarea className="qm-input qm-textarea" placeholder="Brief description of the quiz..." value={quizDesc} onChange={(e) => setQuizDesc(e.target.value)} />
            </div>
            <button type="submit" className="qm-btn qm-btn--primary">✚ Create Quiz</button>
          </form>
        </div>
      )}

      {/* ── ADD / EDIT QUESTION ── */}
      {quizId && (
        <>
          <div className={`qm-card${editingId ? " qm-card--editing" : ""}`}>
            <div className="qm-card-head">
              <div className="qm-card-icon">{editingId ? "✏️" : "+"}</div>
              <div>
                <div className="qm-card-title">{editingId ? "Edit Question" : "Add Question"}</div>
                <div className="qm-card-sub">{editingId ? "Update the question details below" : "Fill in the question and all 4 options"}</div>
              </div>
            </div>

            <form className="qm-form" onSubmit={editingId ? handleUpdateQuestion : handleAddQuestion}>
              {/* Question text */}
              <div className="qm-field">
                <label className="qm-label">Question <span className="qm-req">*</span></label>
                <input
                  className="qm-input qm-input--question"
                  placeholder="Type your question here…"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              {/* Options 2×2 */}
              <div className="qm-options-label">
                <label className="qm-label">Options <span className="qm-req">*</span></label>
              </div>
              <div className="qm-options-grid">
                {options.map((opt, i) => (
                  <div key={i} className="qm-option-wrap">
                    <span className="qm-option-letter">{OPTION_LABELS[i]}</span>
                    <input
                      className="qm-input qm-option-input"
                      placeholder={`Option ${OPTION_LABELS[i]}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[i] = e.target.value;
                        setOptions(copy);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Points + Order */}
              <div className="qm-meta-row">
                <div className="qm-field">
                  <label className="qm-label">Points</label>
                  <input className="qm-input" type="number" min="1" value={points} onChange={(e) => setPoints(e.target.value)} />
                </div>
                <div className="qm-field">
                  <label className="qm-label">Order</label>
                  <input className="qm-input" type="number" min="1" value={order} onChange={(e) => setOrder(e.target.value)} />
                </div>
              </div>

              {/* Buttons */}
              <div className="qm-form-btns">
                <button type="submit" className="qm-btn qm-btn--primary" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "✔ Update Question" : "✚ Add Question"}
                </button>
                {editingId && (
                  <button type="button" className="qm-btn qm-btn--ghost" onClick={() => resetForm(questions.length + 1)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── SET ANSWERS BANNER ── */}
          {questions.length > 0 && (
            <div className="qm-answers-banner">
              <div className="qm-answers-banner-icon">✅</div>
              <div className="qm-answers-banner-text">
                <div className="qm-answers-banner-title">Ready to set correct answers?</div>
                <div className="qm-answers-banner-sub">Mark the correct option for each question after the match ends.</div>
              </div>
              <Link to={`/admin/matches/${matchId}/answers`} className="qm-btn qm-btn--answers">
                Set Answers →
              </Link>
            </div>
          )}

          {/* ── QUESTIONS LIST ── */}
          <div className="qm-card">
            <div className="qm-list-header">
              <div className="qm-card-title">Questions</div>
              <div className="qm-count-badge">{questions.length}</div>
            </div>

            {questions.length === 0 ? (
              <div className="qm-empty">No questions yet. Add your first question above ↑</div>
            ) : (
              <div className="qm-question-list">
                {sorted.map((q) => {
                  const id = q._id || q.id;
                  const isEditing = editingId === id;
                  return (
                    <div key={id} className={`qm-question-card${isEditing ? " qm-question-card--active" : ""}`}>
                      {/* Question number + text */}
                      <div className="qm-q-top">
                        <span className="qm-q-num">Q{q.order}</span>
                        <span className="qm-q-text">{q.questionText}</span>
                        <span className="qm-q-points">⭐ {q.points} pts</span>
                      </div>

                      {/* Options */}
                      <div className="qm-q-options">
                        {q.options.map((opt, i) => (
                          <span key={i} className="qm-q-option">
                            <span className="qm-q-option-letter">{OPTION_LABELS[i]}</span>
                            {opt}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="qm-q-actions">
                        <button className="qm-btn qm-btn--edit" onClick={() => handleStartEdit(q)}>
                          ✏ Edit
                        </button>
                        {deleteConfirmId === id ? (
                          <>
                            <button className="qm-btn qm-btn--danger-confirm" onClick={() => handleDeleteQuestion(id)}>
                              Confirm Delete
                            </button>
                            <button className="qm-btn qm-btn--ghost" onClick={() => setDeleteConfirmId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button className="qm-btn qm-btn--danger" onClick={() => setDeleteConfirmId(id)}>
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
