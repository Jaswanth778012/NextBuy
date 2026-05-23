import React from "react";

import { useNavigate }
from "react-router-dom";

import "../App.css";

function AdminDashboard() {

  const navigate = useNavigate();

  // CHECK TOKEN
  const token =
    localStorage.getItem("token");

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
          <p>1,245</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Orders</h2>
          <p>560</p>
        </div>

        <div className="dashboard-card">
          <h2>Revenue</h2>
          <p>₹2.4L</p>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;