import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import {
  adminCreateQuiz,
  adminFetchQuestionsByQuiz,
  adminCreateQuestion,
} from "../../services/adminQuiz.service";
import "../../styles/admin-quiz.css";

export default function AdminQuizManager() {
  const { matchId } = useParams();

  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [points, setPoints] = useState(5);
  const [order, setOrder] = useState(1);

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

  const onCreateQuiz = async (e) => {
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
    } catch (e) {
      setError("Quiz already exists for this match");
    }
  };

  const onAddQuestion = async (e) => {
    e.preventDefault();
    setError("");

    if (!questionText.trim()) return setError("Question is required");
    if (options.some((o) => !o.trim())) return setError("Fill all options");

    await adminCreateQuestion({
      quizId,
      questionText: questionText.trim(),
      options,
      points: Number(points),
      order: Number(order),
    });

    setQuestionText("");
    setOptions(["", ""]);
    setOrder(order + 1);
    setPoints(5);
    await loadQuestions(quizId);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <Link
          to="/admin/matches"
          className="back-link"
          style={{ marginBottom: "30px" }}
        >
          ← Back to Matches
        </Link>
        <header className="admin-header">
          <h1>Quiz Management</h1>
          <span>
            Match ID: <code>{matchId}</code>
          </span>
        </header>

        {error && <div className="admin-error">{error}</div>}

        {!quizId && (
          <section className="admin-card">
            <h2>Create Quiz</h2>
            <form onSubmit={onCreateQuiz} className="form-stack">
              <input
                placeholder="Quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
              <textarea
                placeholder="Description (optional)"
                value={quizDesc}
                onChange={(e) => setQuizDesc(e.target.value)}
              />
              <button className="primary-btn">Create Quiz</button>
            </form>
          </section>
        )}

        {quizId && (
          <>
            <section className="admin-card">
              <h2>Add Question</h2>
              <form onSubmit={onAddQuestion} className="form-stack">
                <input
                  placeholder="Question text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />

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

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setOptions([...options, ""])}
                >
                  + Add Option
                </button>

                <div className="inline-row">
                  <input
                    type="number"
                    placeholder="Points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Order"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </div>

                <button className="primary-btn">Add Question</button>
              </form>
            </section>

            <section className="admin-card">
              <h2>Questions</h2>

              {questions.length === 0 ? (
                <div className="info-box">No questions added</div>
              ) : (
                questions
                  .sort((a, b) => a.order - b.order)
                  .map((q) => (
                    <div key={q._id || q.id} className="question-row">
                      <div className="q-title">
                        {q.order}. {q.questionText}
                      </div>
                      <div className="q-options">{q.options.join(" • ")}</div>
                      <div className="q-points">Points: {q.points}</div>
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
