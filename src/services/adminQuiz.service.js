import { api } from "./api";

export async function adminCreateQuiz(payload) {
  // { matchId, title, description }
  const res = await api.post("/api/admin/quizzes", payload);
  return res.data; // expect quiz object with id
}

export async function adminFetchQuestionsByQuiz(quizId) {
  const res = await api.get(`/api/admin/questions/quiz/${quizId}`);
  return res.data; // [] or { questions: [] }
}

export async function adminCreateQuestion(payload) {
  // { quizId, questionText, options[], points, order }
  const res = await api.post("/api/admin/questions", payload);
  return res.data;
}

export async function adminFetchQuizzes() {
  const res = await api.get("/api/admin/quizzes");
  return res.data; // expects array
}