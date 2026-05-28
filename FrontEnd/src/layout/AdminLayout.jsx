import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import AdminSidebar
from "../components/adminDashboard/AdminSidebar";

import AdminHeader
from "../components/adminDashboard/AdminHeader";

import {
  globalSearch,
} from "../services/adminService";

import SearchResultModal
from "../components/adminDashboard/SearchResultModal";

import "../styles/AdminDashboard.css";

function AdminLayout() {

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem("token");

  // =========================
  // SIDEBAR
  // =========================

  const [sidebarOpen,
    setSidebarOpen] =
    useState(true);

  // =========================
  // THEME
  // =========================

  const [theme,
    setTheme] =
    useState("light");

  // =========================
  // SEARCH
  // =========================

  const [searchKeyword,
    setSearchKeyword] =
    useState("");

  const [searchResults,
    setSearchResults] =
    useState(null);

  const [selectedResult,
    setSelectedResult] =
    useState(null);

  const [selectedType,
    setSelectedType] =
    useState("");

  const searchTimeoutRef =
    useRef(null);

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {

    if (!token) {

      navigate("/login");
    }

  }, [token, navigate]);

  // =========================
  // LOAD THEME
  // =========================

  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        "adminTheme"
      );

    if (

      savedTheme === "light" ||

      savedTheme === "dark"

    ) {

      setTheme(savedTheme);
    }

  }, []);

  // =========================
  // SAVE THEME
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "adminTheme",
      theme
    );

  }, [theme]);

  // =========================
  // TOGGLE THEME
  // =========================

  const toggleTheme = () => {

    setTheme((prev) =>

      prev === "light"
        ? "dark"
        : "light"
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/login");
  };

  // =========================
  // GLOBAL SEARCH
  // =========================

  const handleGlobalSearch =
    (e) => {

      const keyword =
        e.target.value;

      setSearchKeyword(
        keyword
      );

      // EMPTY SEARCH

      if (!keyword.trim()) {

        setSearchResults(null);

        return;
      }

      // CLEAR OLD TIMER

      if (
        searchTimeoutRef.current
      ) {

        clearTimeout(
          searchTimeoutRef.current
        );
      }

      // DEBOUNCE SEARCH ✨

      searchTimeoutRef.current =
        setTimeout(async () => {

          try {

            const data =
              await globalSearch(
                keyword
              );

            setSearchResults(
              data
            );

          } catch (error) {

            console.log(error);
          }

        }, 400);
  };

  // =========================
  // CLOSE SEARCH DROPDOWN
  // =========================

  useEffect(() => {

    const closeSearch =
      (e) => {

        if (

          !e.target.closest(
            ".search-container"
          )

        ) {

          setSearchResults(
            null
          );
        }
      };

    document.addEventListener(
      "click",
      closeSearch
    );

    return () => {

      document.removeEventListener(
        "click",
        closeSearch
      );
    };

  }, []);

  // =========================
  // CLEANUP TIMER
  // =========================

  useEffect(() => {

    return () => {

      if (
        searchTimeoutRef.current
      ) {

        clearTimeout(
          searchTimeoutRef.current
        );
      }
    };

  }, []);

  // =========================
  // PREVENT PAGE FLASH
  // =========================

  if (!token) {

    return null;
  }

  return (

    <div
      className={`admin-layout ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      {/* =========================
          SIDEBAR
      ========================== */}

      <AdminSidebar

        sidebarOpen={
          sidebarOpen
        }

        setSidebarOpen={
          setSidebarOpen
        }

        handleLogout={
          handleLogout
        }
      />

      {/* =========================
          MAIN AREA
      ========================== */}

      <div
        className={`admin-main ${
          sidebarOpen
            ? ""
            : "expanded"
        }`}
      >

        {/* =========================
            HEADER
        ========================== */}

        <AdminHeader

          searchKeyword={
            searchKeyword
          }

          handleGlobalSearch={
            handleGlobalSearch
          }

          searchResults={
            searchResults
          }

          setSelectedResult={
            setSelectedResult
          }

          setSelectedType={
            setSelectedType
          }

          setSearchResults={
            setSearchResults
          }

          setSearchKeyword={
            setSearchKeyword
          }

          theme={theme}

          toggleTheme={
            toggleTheme
          }
        />

        {/* =========================
            PAGE CONTENT
        ========================== */}

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

      {/* =========================
          SEARCH RESULT MODAL
      ========================== */}

      <SearchResultModal

        selectedResult={
          selectedResult
        }

        selectedType={
          selectedType
        }

        setSelectedResult={
          setSelectedResult
        }

        sidebarOpen={
          sidebarOpen
        }
      />

    </div>
  );
}

export default AdminLayout;