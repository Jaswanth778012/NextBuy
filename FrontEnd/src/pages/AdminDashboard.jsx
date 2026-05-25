import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTotalStats } from "../services/AdminStatsService";
import { globalSearch } from "../services/adminService";

import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import DashboardCards from "../components/adminDashboard/DashboardCards";
import SearchResultModal from "../components/adminDashboard/SearchResultModal";
import MonthlyOrdersChart from "../components/adminDashboard/MonthlyOrdersChart";
import TopSellingProductsTable from "../components/adminDashboard/TopSellingProductsTable";

import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [selectedResult, setSelectedResult] = useState(null);

  const [selectedType, setSelectedType] = useState("");

  const [topProducts, setTopProducts] = useState([]);

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

  const fetchTopProducts = async () => {
  try {
    const response = await getTopSellingProducts();

    const top5 = response.data
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    setTopProducts(top5);
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
    fetchTopProducts();
  }, [token, navigate]);

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
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">
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
        />

        <DashboardCards stats={stats} />
         <MonthlyOrdersChart />

         <TopSellingProductsTable
  products={topProducts} />
  
        <SearchResultModal
        selectedResult={selectedResult}
        selectedType={selectedType}
        setSelectedResult={setSelectedResult}
      />
      </div>
    </div>
  );
}

export default AdminDashboard;
