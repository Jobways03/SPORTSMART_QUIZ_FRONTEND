import { api } from "./api";

/* ---------- GLOBAL ---------- */
export async function fetchDashboardAnalytics() {
  const res = await api.get("/api/admin/analytics/dashboard");
  return res.data;
}

export async function fetchTimeSeriesAnalytics() {
  const res = await api.get("/api/admin/analytics/timeseries");
  return res.data;
}

/* ---------- QUIZ LEVEL ---------- */
export async function fetchQuizHeatmap(quizId) {
  const res = await api.get(`/api/admin/analytics/quizzes/${quizId}/heatmap`);
  return res.data;
}

export async function fetchTopUsersByQuiz(quizId, limit = 10) {
  const res = await api.get(
    `/api/admin/analytics/quizzes/${quizId}/top-users?limit=${limit}`
  );
  return res.data;
}

export async function fetchSubmissionTiming(quizId) {
  const res = await api.get(
    `/api/admin/analytics/quizzes/${quizId}/submission-timing`
  );
  return res.data;
}
