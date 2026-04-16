import { api } from "./api";

export async function fetchAdminUsers() {
  const res = await api.get("/api/admin/users");
  return res.data;
}
