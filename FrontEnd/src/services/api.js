import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
});

let isRedirecting = false;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const token = localStorage.getItem("token");

    if ((status === 401 || status === 403) && token) {
      if (isRedirecting) {
        return Promise.reject(error);
      }

      isRedirecting = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.setItem(
        "sessionExpired",
        "Your session has expired. Please login again."
      );

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default API;