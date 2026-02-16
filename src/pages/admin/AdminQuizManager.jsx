import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  adminCreateQuiz,
  adminFetchQuestionsByQuiz,
  adminCreateQuestion,
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

  /* ---------------- LOAD EXISTING QUIZ ---------------- */
  useEffect(() => {
    const storedQuizId = sessionStorage.getItem(`quiz_${matchId}`);
    if (storedQuizId) {
      setQuizId(storedQuizId);
      loadQuestions(storedQuizId);
    }
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
      sessionStorage.setItem(`quiz_${matchId}`, id);
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
              <h2>Add Question</h2>

              <form className="admin-form-stack" onSubmit={handleAddQuestion}>
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

                <button className="admin-btn-primary">Add Question</button>
              </form>
            </section>

            {/* ================= QUESTIONS LIST ================= */}
            <section className="admin-card">
              <h2>Questions</h2>

              {questions.length === 0 ? (
                <div className="admin-info-box">No questions added</div>
              ) : (
                questions
                  .sort((a, b) => a.order - b.order)
                  .map((q) => (
                    <div key={q._id || q.id} className="admin-question-row">
                      <div className="admin-q-title">
                        {q.order}. {q.questionText}
                      </div>
                      <div className="admin-q-options">
                        {q.options.join(" • ")}
                      </div>
                      <div className="admin-q-points">Points: {q.points}</div>
                    </div>
                  ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
