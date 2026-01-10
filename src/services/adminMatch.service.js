import { api } from "./api";

export async function adminFetchMatches() {
  const res = await api.get("/api/admin/matches/admin");
  return res.data; // [] or { matches: [] }
}

export async function adminCreateMatch(payload) {
  // { title, tournament, startTime }
  const res = await api.post("/api/admin/matches", payload);
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