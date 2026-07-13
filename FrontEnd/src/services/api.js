import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token !== ""
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = (error?.config?.url || "").toLowerCase();
    const currentPath = window.location.pathname;

    // Ignore auth endpoint errors
    if (requestUrl.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Don't redirect if already on login/register page
    if (currentPath === "/login" || currentPath === "/register") {
      return Promise.reject(error);
    }

    // Handle expired/invalid session for USER and ADMIN
    if (status === 401 || status === 403) {
      const token = localStorage.getItem("token");

      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        sessionStorage.setItem(
          "sessionExpired",
          "Your session has expired. Please login again."
        );

        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;