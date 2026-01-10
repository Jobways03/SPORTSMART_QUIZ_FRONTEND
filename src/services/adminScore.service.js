import { api } from "./api";

export async function adminScoreQuiz(quizId) {
  const res = await api.post(`/api/admin/quizzes/${quizId}/score`);
  return res.data;
  // Expected:
  // { message: "Responses scored successfully", scoredCount: 3 }
}
