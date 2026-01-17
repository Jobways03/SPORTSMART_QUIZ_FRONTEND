import { api } from "./api";

export async function adminFetchMatches() {
  const res = await api.get("/api/admin/matches/admin");
  return res.data; // [] or { matches: [] }
}

export async function adminCreateMatch(formData) {
  const res = await api.post("/api/admin/matches", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
export async function adminUpdateMatchStatus(matchId, status) {
  const res = await api.patch(`/api/admin/matches/${matchId}`, { status });
  return res.data;
}

export async function adminDeleteMatchStatus(matchId) {
  const res = await api.delete(`/api/admin/matches/${matchId}`);
  return res.data;
}