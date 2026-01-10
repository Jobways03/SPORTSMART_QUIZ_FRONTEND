import { api } from "./api";

export async function adminPublishResults(quizId) {
  const res = await api.post(`/api/admin/quizzes/${quizId}/publish`);
  return res.data;
  // Expected:
  // { message: "Results published successfully" }
}
