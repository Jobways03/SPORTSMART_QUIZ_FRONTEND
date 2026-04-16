import { api } from "./api";

export async function createWinnerOverride(quizId, { displayName, phone, score, photo }) {
  const formData = new FormData();
  formData.append("displayName", displayName);
  formData.append("score", score);
  if (phone) formData.append("phone", phone);
  if (photo) formData.append("photo", photo);

  const res = await api.post(`/api/admin/quizzes/${quizId}/override`, formData);
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
