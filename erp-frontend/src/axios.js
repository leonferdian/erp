import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add interceptor to refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // force logout
      }
    }
    return Promise.reject(err);
  }
);

export default api;
