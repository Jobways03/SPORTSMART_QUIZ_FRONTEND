import { api } from "./api";

export async function createWinnerOverride(quizId, { displayName, phone, score }) {
  const res = await api.post(`/api/admin/quizzes/${quizId}/override`, {
    displayName,
    ...(phone ? { phone } : {}),
    score,
  });
  return res.data;
}

export async function getWinnerOverride(quizId) {
  const res = await api.get(`/api/admin/quizzes/${quizId}/override`);
  return res.data; // { override: {...} | null }
}

export async function deleteWinnerOverride(quizId) {
  const res = await api.delete(`/api/admin/quizzes/${quizId}/override`);
  return res.data;
}
