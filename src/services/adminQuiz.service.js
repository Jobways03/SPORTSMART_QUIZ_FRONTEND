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

export async function adminFetchQuizzesByMatch(matchId) {
  const res = await api.get(`/api/admin/quizzes/match/${matchId}`);
  return res.data; // array of quizzes for this match
}

export async function adminUpdateQuestion(questionId, payload) {
  // payload can include: { questionText, options[], points, order }
  const res = await api.patch(`/api/admin/questions/${questionId}`, payload);
  return res.data;
}

export async function adminDeleteQuestion(questionId) {
  const res = await api.delete(`/api/admin/questions/${questionId}`);
  return res.data;
}