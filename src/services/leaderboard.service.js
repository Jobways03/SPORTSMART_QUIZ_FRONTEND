import { api } from "./api";

export async function fetchLeaderboard(quizId) {
  const res = await api.get(`/api/leaderboard/${quizId}`);
  return res.data; // { leaderboard: [...] }
}

export async function fetchUserRank({ quizId, userId }) {
  const res = await api.get(`/api/leaderboard/${quizId}/rank/${userId}`);
  return res.data; // { rank: number }
}
