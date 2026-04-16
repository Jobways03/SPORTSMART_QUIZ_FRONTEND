import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:8000",
});

  api.interceptors.request.use(
    (config) => {
      // Set JSON content-type for all requests except FormData
      // (for FormData, let the browser set it automatically with the correct boundary)
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      // 1. Handle Admin Token — only attach to admin API routes
      const isAdminRoute = config.url && config.url.includes("/api/admin/");
      if (isAdminRoute) {
        const token = localStorage.getItem("cricketquiz_admin_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
