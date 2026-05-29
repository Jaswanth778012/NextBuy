import React from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {

    const navigate = useNavigate();

    const location = useLocation();

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div
        className="sidebar-toggle-arrow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "‹" : "›"}
      </div>

      <div className="sidebar-logo">
        <h2>{sidebarOpen ? "NestBuy" : "NB"}</h2>
      </div>

      <nav className="sidebar-nav">
        <button className={`nav-item ${
            location.pathname === "/admin/dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/admin/dashboard")}>
          <FaTachometerAlt />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        <button  className={`nav-item ${
            location.pathname === "/admin/userManagement" ? "active" : ""
          }`}
          onClick={() => navigate("/admin/userManagement")}>
          <FaUsers />
          {sidebarOpen && <span>Users</span>}
        </button>

        <button className="nav-item">
          <FaBoxOpen />
          {sidebarOpen && <span>Orders</span>}
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/admin/options")}
        >
          <FaCog />
          {sidebarOpen && <span>Options</span>}
        </button>

        <button className="nav-item logout-nav" onClick={handleLogout}>
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>

        
      </nav>
    </aside>
  );
}

export default AdminSidebar;