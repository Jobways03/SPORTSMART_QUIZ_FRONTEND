import { api } from "./api";

export async function fetchActiveQuiz(matchId) {
  const res = await api.get(`/api/quizzes/active/${matchId}`);
  return res.data;
}
