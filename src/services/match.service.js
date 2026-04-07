import { api } from "./api";

export async function fetchMatches() {
  const res = await api.get("/api/matches/user");
  return res.data;
}
