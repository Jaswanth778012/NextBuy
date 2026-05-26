import React from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {
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

        <button className="nav-item">
          <FaChartLine />
          {sidebarOpen && <span>Analytics</span>}
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