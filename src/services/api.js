import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://sportsmart-quiz-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Handle Admin Token
    const token = localStorage.getItem("cricketquiz_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Handle User Data (shiva@gmail.com, etc.)
    const userData = localStorage.getItem("cricketquiz_user");

    if (userData) {
      try {
        const user = JSON.parse(userData);

        // Sending specific fields to the backend via custom headers
        if (user.userId) {
          config.headers["X-User-Id"] = user.userId;
        }
        if (user.email) {
          config.headers["X-User-Email"] = user.email;
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
