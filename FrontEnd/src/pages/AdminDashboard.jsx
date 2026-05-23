import React, {
  useEffect,
  useState
} from "react";

import { useNavigate }
from "react-router-dom";

import {
  getTotalStats
} from "../services/AdminStatsService";

import "../App.css";

function AdminDashboard() {

  const navigate = useNavigate();

  // STATE
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

  // CHECK TOKEN
  const token =
    localStorage.getItem("token");

  // FETCH STATS
  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const response =
        await getTotalStats();

      console.log(response.data);

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  // LOGIN
  const handleLogin = () => {

    navigate("/login");
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");
  };

  return (

    <div className="admin-dashboard">

      {/* TOP BAR */}
      <div className="admin-header">

        <h1 className="admin-title">
          Admin Dashboard 👑
        </h1>

        {/* LOGIN / LOGOUT BUTTON */}
        {!token ? (

          <button
            className="admin-btn"
            onClick={handleLogin}
          >
            Login
          </button>

        ) : (

          <button
            className="admin-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

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
  );
}

export default AdminDashboard;