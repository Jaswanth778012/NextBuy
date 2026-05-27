import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";

import {
  getTotalStats,
  getTopSellingProducts,
  getAllCategories,

  getSubCategoriesByCategory,
} from "../services/AdminStatsService";

import { globalSearch } from "../services/adminService";

import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import DashboardCards from "../components/adminDashboard/DashboardCards";
import SearchResultModal from "../components/adminDashboard/SearchResultModal";
import MonthlyOrdersChart from "../components/adminDashboard/MonthlyOrdersChart";
import TopSellingProductsTable from "../components/adminDashboard/TopSellingProductsTable";

import "../styles/AdminDashboard.css";

import CategorySalesPieChart from "../components/adminDashboard/CategorySalesPieChart";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [selectedResult, setSelectedResult] = useState(null);

  const [selectedType, setSelectedType] = useState("");

  const [topProducts, setTopProducts] = useState([]);

  const [categories, setCategories] =
  useState([]);

const [subCategories, setSubCategories] =
  useState([]);

const [selectedCategory,
  setSelectedCategory] = useState(null);

const [selectedSubCategory,
  setSelectedSubCategory] = useState("");

  const searchTimeoutRef = useRef(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    TotalRevanue: 0,
    monthlyRevanue: 0,
    yearlyRevanue: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    TotallowStockProducts: 0,
    TotalHighStockProducts: 0,
  });

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  useEffect(() => {
    if (location.state?.loginSuccess && !toastShown.current) {
      toastShown.current = true;

      toast.success("Welcome Admin 🚀");

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await getTotalStats();

      setStats(response.data);

      setError("");
    } catch (err) {
      console.error(err);

      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {

  try {

    const response =
      await getAllCategories();

    setCategories(response.data);

  } catch (error) {

    console.error(error);

  }
};

const fetchSubCategoriesByCategory =
  async (categoryId) => {

    try {

      const response =
        await getSubCategoriesByCategory(
          categoryId
        );

      setSubCategories(response.data);

    } catch (error) {

      console.error(error);

    }
};

 const fetchTopProducts = async (
  category = "",
  subCategory = "",
) => {

  try {

    const response =
      await getTopSellingProducts(
        category,
        subCategory
      );

    setTopProducts(
      [...response.data]
        .sort((a, b) =>
          b.totalSold - a.totalSold
        )
        .slice(0, 5)
    );

  } catch (error) {

    console.error(error);

  }
};

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStats();
    fetchCategories();
  }, [token, navigate]);

  useEffect(() => {

  if (selectedCategory?.id) {

    fetchSubCategoriesByCategory(
      selectedCategory.id
    );

  } else {

    setSubCategories([]);
  }

  setSelectedSubCategory("");

}, [selectedCategory]);

useEffect(() => {

  fetchTopProducts(
    selectedCategory?.name || "",
    selectedSubCategory
  );

}, [
  selectedCategory,
  selectedSubCategory,
]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // GLOBAL SEARCH
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
        console.log(error);
      }
    }, 400);
  };

  // CLOSE SEARCH DROPDOWN
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

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="dashboard-status-card">
          <div className="dashboard-loader"></div>
          <h2>Loading Dashboard</h2>
          <p>Fetching latest statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <div className="dashboard-status-card error-card">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Statistics</h2>
          <p>{error}</p>

          <button className="retry-btn" onClick={fetchStats}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-layout ${theme === "dark" ? "dark-mode" : ""}`}>
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="admin-main">
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

        <DashboardCards stats={stats} sidebarOpen={sidebarOpen}/>
        <div className="charts-wrapper">
          <MonthlyOrdersChart />

          <CategorySalesPieChart />
        </div>

        <TopSellingProductsTable

  products={topProducts}

  categories={categories}

  subCategories={subCategories}

  selectedCategory={selectedCategory}
  setSelectedCategory={
    setSelectedCategory
  }

  selectedSubCategory={
    selectedSubCategory
  }

  setSelectedSubCategory={
    setSelectedSubCategory
  }
/>

        <SearchResultModal
          selectedResult={selectedResult}
          selectedType={selectedType}
          setSelectedResult={setSelectedResult}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
