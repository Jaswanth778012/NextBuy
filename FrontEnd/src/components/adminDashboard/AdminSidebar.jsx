import React from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";

<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate, useLocation } from "react-router-dom";
>>>>>>> f0c60e2918836391912e47267e1d0162b7325d2e

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {

<<<<<<< HEAD
  // ✅ FIX ADDED HERE
  const navigate = useNavigate();
=======
    const navigate = useNavigate();

    const location = useLocation();
>>>>>>> f0c60e2918836391912e47267e1d0162b7325d2e

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