import { api } from "./api";

export async function fetchMatches() {
  const res = await api.get(`/api/matches/user?_t=${Date.now()}`);
  return res.data;
}
