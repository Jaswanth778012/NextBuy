import React, { useEffect, useRef, useState } from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import SearchResultModal from "../components/adminDashboard/SearchResultModal";

import { globalSearch } from "../services/adminService";

import {
  useAuth,
  notifyAuthChange,
} from "../hooks/useAuth";

import "../styles/AdminDashboard.css";

function AdminLayout() {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    notifyAuthChange();

    navigate("/login", { replace: true });
  };

  const handleGlobalSearch = (e) => {
    const keyword = e.target.value;

    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setSearchResults(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await globalSearch(keyword);
        setSearchResults(data);
      } catch (error) {
        console.log("Global search error:", error);
      }
    }, 400);
  };

  useEffect(() => {
    const closeSearch = (e) => {
      if (!e.target.closest(".search-container")) {
        setSearchResults(null);
      }
    };

    document.addEventListener("click", closeSearch);

    return () => {
      document.removeEventListener("click", closeSearch);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      className={`admin-layout ${
        theme === "dark" ? "dark-mode" : ""
      }`}
    >
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div
        className={`admin-main ${
          sidebarOpen ? "" : "expanded"
        }`}
      >
        <AdminHeader
          searchKeyword={searchKeyword}
          handleGlobalSearch={handleGlobalSearch}
          searchResults={searchResults}
          setSelectedResult={setSelectedResult}
          setSelectedType={setSelectedType}
          setSearchResults={setSearchResults}
          setSearchKeyword={setSearchKeyword}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="admin-page-content">
          <Outlet
            context={{
              sidebarOpen,
              theme,
              selectedResult,
              selectedType,
              setSelectedResult,
              setSelectedType,
              setSearchResults,
              setSearchKeyword,
            }}
          />
        </div>
      </div>

      <SearchResultModal
        selectedResult={selectedResult}
        selectedType={selectedType}
        setSelectedResult={setSelectedResult}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}

export default AdminLayout;