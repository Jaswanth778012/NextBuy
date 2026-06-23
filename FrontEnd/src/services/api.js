import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = (error?.config?.url || "").toLowerCase();
    const currentPath = window.location.pathname;

    if (requestUrl.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (currentPath === "/login" || currentPath === "/register") {
      return Promise.reject(error);
    }

    if (status === 401) {
      const token = localStorage.getItem("token");

      if (!token) {
        return Promise.reject(error);
      }

      const isProtectedEndpoint =
        requestUrl.includes("/user/") ||
        requestUrl.includes("/orders/") ||
        requestUrl.includes("/cart/") ||
        requestUrl.includes("/wishlist/") ||
        requestUrl.includes("/address/") ||
        requestUrl.includes("/payments/verify/") ||
        requestUrl.includes("/wishlist-alerts/") ||
        requestUrl.includes("/cupon/") ||
        requestUrl.includes("/admin/");

      if (isProtectedEndpoint) {
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