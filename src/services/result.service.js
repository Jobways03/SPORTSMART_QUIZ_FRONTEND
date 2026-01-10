import { api } from "./api";

export async function fetchUserResults({ quizId, userId }) {
  const res = await api.get(`/api/results/${quizId}/${userId}`);
  return res.data;
}
