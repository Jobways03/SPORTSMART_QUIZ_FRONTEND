import { api } from "./api";

/**
 * Phone login — check if user exists
 * Returns { isNewUser: true } or { isNewUser: false, userId, name, phone }
 */
export async function phoneLogin({ phone }) {
  const res = await api.post("/api/auth/user/login", { phone });
  return res.data;
}

/**
 * Phone register — create new user with phone + name
 * Returns { isNewUser: false, userId, name, phone }
 */
export async function phoneRegister({ phone, name }) {
  const res = await api.post("/api/auth/user/register", { phone, name });
  return res.data;
}
