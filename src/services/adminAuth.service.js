import { api } from "./api";

export async function adminLogin({ email, password }) {
  const res = await api.post("/api/admin/auth/login", { email, password });
  return res.data;
  // expected:
  // { token: "...", admin: { id, email, role } }
}
