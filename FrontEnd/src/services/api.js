import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined" && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const currentPath = window.location.pathname;

    // Skip auth endpoints
    if (requestUrl.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Skip if already on login/register
    if (currentPath === "/login" || currentPath === "/register") {
      return Promise.reject(error);
    }

    // Only handle 401/403 that indicate EXPIRED/INVALID token
    if (status === 401 || status === 403) {
      const token = localStorage.getItem("token");
      
      // If no token, just reject (user isn't logged in)
      if (!token) {
        return Promise.reject(error);
      }

      // Check if this is a protected endpoint (not public data)
      const isProtectedEndpoint = 
        requestUrl.includes("/user/") ||
        requestUrl.includes("/order/") ||
        requestUrl.includes("/cart/") ||
        requestUrl.includes("/wishlist/") ||
        requestUrl.includes("/admin/") ||
        requestUrl.includes("/profile");

      // Only wipe token on protected endpoints or explicit auth failures
      if (isProtectedEndpoint || status === 403) {
        console.warn("Auth failed on protected endpoint, clearing session");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        
        sessionStorage.setItem(
          "sessionExpired",
          "Your session has expired. Please login again."
        );
        
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;