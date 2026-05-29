import React from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {

  // ✅ FIX ADDED HERE
  const navigate = useNavigate();

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