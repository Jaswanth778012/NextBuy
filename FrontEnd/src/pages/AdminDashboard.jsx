import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getTotalStats
} from "../services/AdminStatsService";

import {
  FaSearch,
  FaBell,
  FaMoon,
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  globalSearch,
} from "../services/adminService";

import "../styles/AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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
    TotalHighStockProducts: 0
  });

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await getTotalStats();

      console.log("Stats Response:", response);

      setStats(response.data);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStats();
  }, [token, navigate]);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [searchResults, setSearchResults] =
    useState(null);

  // SEARCH TIMER REF

  const searchTimeoutRef =
    useRef(null);



  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");
  };

  // ===============================
  // GLOBAL SEARCH
  // ===============================

  const handleGlobalSearch = (
    e
  ) => {

    const keyword = e.target.value;

    setSearchKeyword(keyword);

    // EMPTY SEARCH

    if (!keyword.trim()) {

      setSearchResults(null);

      return;
    }

    // CLEAR OLD TIMER

    if (searchTimeoutRef.current) {

      clearTimeout(
        searchTimeoutRef.current
      );
    }

    // NEW TIMER

    searchTimeoutRef.current =
      setTimeout(async () => {

        try {

          const data =
            await globalSearch(keyword);

          console.log(
            "SEARCH DATA",
            data
          );

          setSearchResults(data);

        } catch (error) {

          console.log(error);
        }

      }, 400);
  };

  // ===============================
  // CLOSE SEARCH DROPDOWN
  // ===============================

  useEffect(() => {

    const closeSearch = (e) => {

      if (
        !e.target.closest(
          ".search-container"
        )
      ) {

        setSearchResults(null);
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
    {/* SIDEBAR */}
    <aside
      className={`admin-sidebar ${
        sidebarOpen ? "open" : "closed"
      }`}
    >
      <div
        className="sidebar-toggle-arrow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "‹" : "›"}
      </div>

      <div className="sidebar-logo">
        <h2>{sidebarOpen ? "NextBuy" : "NB"}</h2>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <FaTachometerAlt />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        <button className="nav-item">
          <FaUsers />
          {sidebarOpen && <span>Users</span>}
        </button>

        <button className="nav-item">
          <FaBoxOpen />
          {sidebarOpen && <span>Orders</span>}
        </button>

        <button className="nav-item">
          <FaChartLine />
          {sidebarOpen && <span>Analytics</span>}
        </button>

        <button
          className="nav-item logout-nav"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>

    {/* MAIN */}
    <div className="admin-main">
      {/* HEADER */}
      <header className="admin-header">
        {/* SEARCH */}
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search users, products, brands..."
              value={searchKeyword}
              onChange={handleGlobalSearch}
            />

            <span className="shortcut">⌘ K</span>
          </div>

          {searchResults && (
            <div className="search-results">
              {/* USERS */}
              {searchResults.users?.length > 0 && (
                <div className="search-section">
                  <h4>Users</h4>

                  {searchResults.users.map((user, index) => (
                    <div
                      key={index}
                      className="search-item"
                    >
                      👤 {user.username}
                    </div>
                  ))}
                </div>
              )}

              {/* PRODUCTS */}
              {searchResults.products?.length > 0 && (
                <div className="search-section">
                  <h4>Products</h4>

                  {searchResults.products.map(
                    (product, index) => (
                      <div
                        key={index}
                        className="search-item"
                      >
                        📦 {product.name}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* BRANDS */}
              {searchResults.brands?.length > 0 && (
                <div className="search-section">
                  <h4>Brands</h4>

                  {searchResults.brands.map(
                    (brand, index) => (
                      <div
                        key={index}
                        className="search-item"
                      >
                        🏷️ {brand.name}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* ORDERS */}
              {searchResults.orders?.length > 0 && (
                <div className="search-section">
                  <h4>Orders</h4>

                  {searchResults.orders.map(
                    (order, index) => (
                      <div
                        key={index}
                        className="search-item"
                      >
                        🧾 Order ID: {order.id}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* EMPTY */}
              {searchResults.users?.length === 0 &&
                searchResults.products?.length === 0 &&
                searchResults.orders?.length === 0 &&
                searchResults.brands?.length === 0 && (
                  <div className="empty-search">
                    No Results Found
                  </div>
                )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="header-right">
          <button className="header-icon">
            <FaMoon />
          </button>

          <button className="header-icon notification">
            <FaBell />
            <span className="dot"></span>
          </button>

          <div className="profile-box">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
            />
            <span>Musharof</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Total Users</h2>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Products</h2>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Revenue</h2>
          <p>₹{stats.TotalRevanue}</p>
        </div>

        <div className="dashboard-card">
          <h2>Monthly Revenue</h2>
          <p>₹{stats.monthlyRevanue}</p>
        </div>

        <div className="dashboard-card">
          <h2>Yearly Revenue</h2>
          <p>₹{stats.yearlyRevanue}</p>
        </div>

        <div className="dashboard-card">
          <h2>Delivered Orders</h2>
          <p>{stats.deliveredOrders}</p>
        </div>

        <div className="dashboard-card">
          <h2>Cancelled Orders</h2>
          <p>{stats.cancelledOrders}</p>
        </div>

        <div className="dashboard-card">
          <h2>Pending Orders</h2>
          <p>{stats.pendingOrders}</p>
        </div>

        <div className="dashboard-card">
          <h2>Low Stock Products</h2>
          <p>{stats.TotallowStockProducts}</p>
        </div>

        <div className="dashboard-card">
          <h2>High Stock Products</h2>
          <p>{stats.TotalHighStockProducts}</p>
        </div>
      </div>
    </div>
  </div>
);
}

export default AdminDashboard;