import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

// =========================
// REQUEST INTERCEPTOR
// =========================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

API.interceptors.response.use(

  (response) => {

    return response;
  },

  (error) => {

    // TOKEN EXPIRED / UNAUTHORIZED

    if (
      error.response &&
      error.response.status === 401
    ) {

      // CLEAR STORAGE

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      // REDIRECT TO LOGIN

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;