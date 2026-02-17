import { api } from "./api";

export async function fetchLeaderboard(quizId) {
  const res = await api.get(`/api/leaderboard/${quizId}`);
  return res.data; // { leaderboard: [...] }
}

export async function fetchUserRank({ quizId, userId }) {
  const res = await api.get(`/api/leaderboard/${quizId}/rank/${userId}`);
  return res.data; // { rank: number }
}

/**
 * Combined: Top 10 + user's rank in one call
 */
export async function fetchFullLeaderboard({ quizId, userId }) {
  const res = await api.get(`/api/leaderboard/${quizId}/full/${userId}`);
  return res.data; // { leaderboard: [...], myEntry: {...}, totalPlayers: number }
}

/**
 * Admin: All players (no limit)
 */
export async function fetchAdminLeaderboard(quizId) {
  const res = await api.get(`/api/admin/leaderboard/${quizId}`);
  return res.data; // { leaderboard: [...], total: number }
}
