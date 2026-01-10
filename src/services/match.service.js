import { api } from "./api";

export async function fetchMatches() {
  const res = await api.get("/api/admin/matches");
  return res.data; // assume array OR {matches: []}
}
