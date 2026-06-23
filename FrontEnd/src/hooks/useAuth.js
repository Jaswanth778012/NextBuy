import { useState, useEffect } from "react";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");

    if (
      !raw ||
      raw === "null" ||
      raw === "undefined" ||
      raw === ""
    ) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  const token = localStorage.getItem("token");

  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token === ""
  ) {
    return null;
  }

  return token;
};

export const normalizeRole = (role) => {
  if (!role) return null;

  const value = String(role).trim().toUpperCase();

  if (value === "ADMIN" || value === "ROLE_ADMIN") {
    return "ADMIN";
  }

  if (value === "USER" || value === "ROLE_USER") {
    return "USER";
  }

  return value;
};

export const isAdminRole = (role) => {
  return normalizeRole(role) === "ADMIN";
};

const readAuthState = () => {
  const user = getStoredUser();
  const token = getStoredToken();

  const role =
    normalizeRole(user?.role) ||
    normalizeRole(localStorage.getItem("role"));

  return {
    user,
    token,
    role,
    isLoggedIn: !!token,
    isAdmin: isAdminRole(role),
  };
};

export const useAuth = () => {
  const [authState, setAuthState] = useState(readAuthState);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState(readAuthState());
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return authState;
};

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event("auth-change"));
};