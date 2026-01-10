import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AdminAuthContext = createContext(null);

const TOKEN_KEY = "cricketquiz_admin_token";
const ADMIN_KEY = "cricketquiz_admin_profile";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [initializing, setInitializing] = useState(true); // 🔑 KEY FIX

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_KEY);

    if (storedToken) setToken(storedToken);

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        localStorage.removeItem(ADMIN_KEY);
      }
    }

    setInitializing(false); // ✅ auth rehydration done
  }, []);

  const login = ({ token, admin }) => {
    setToken(token);
    setAdmin(admin);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  const isAdminAuthed = Boolean(token);

  const value = useMemo(
    () => ({
      token,
      admin,
      isAdminAuthed,
      initializing, // 👈 expose this
      login,
      logout,
    }),
    [token, admin, isAdminAuthed, initializing]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
