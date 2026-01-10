import { api } from "./api";

/**
 * LOGIN
 * identifier = email OR phone
 */
export async function userLogin({ identifier, password }) {
  const res = await api.post("api/auth/user/login", {
    identifier,
    password,
  });
  return res.data; // { userId, name, email, phone }
}

/**
 * REGISTER
 */
export async function registerUser(data) {
  const res = await api.post("api/auth/user/register", data);
  return res.data;
}

/**
 * FORGOT PASSWORD
 */
export async function forgotPassword({ email }) {
  const res = await api.post("api/auth/user/forgot-password", { email });
  return res.data;
}

/**
 * RESET PASSWORD
 */
export async function resetPassword(token, { password }) {
  const res = await api.post(`api/auth/user/reset-password/${token}`, {
    password,
  });
  return res.data;
}
