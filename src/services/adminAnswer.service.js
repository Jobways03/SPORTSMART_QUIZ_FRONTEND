import { api } from "./api";

export async function adminSetCorrectAnswers(quizId, payload) {
  // payload:
  // { answers: [{ questionId, correctOptionIndex, points }] }
  const res = await api.post(`/api/admin/quizzes/${quizId}/answers`, payload);
  return res.data; // { message: "Correct answers saved successfully" }
}
