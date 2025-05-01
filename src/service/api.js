import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Update this to match your backend
});

// Request: Attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response: Intercept 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post("http://localhost:8080/api/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // If refresh also fails, redirect to login
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
