import React, { useState } from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaTags,
  FaCog,
  FaBell,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function AdminSidebar({ sidebarOpen, setSidebarOpen, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);

<<<<<<< HEAD
function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {

  const navigate = useNavigate();

  const location = useLocation();
=======
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4

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
<<<<<<< HEAD
        <button className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""
=======
        <button
          className={`nav-item ${
            location.pathname === "/admin/dashboard" ? "active" : ""
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4
          }`}
          onClick={() => navigate("/admin/dashboard")}
        >
          <FaTachometerAlt />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

<<<<<<< HEAD
        <button className={`nav-item ${location.pathname === "/admin/userManagement" ? "active" : ""
=======
        <button
          className={`nav-item ${
            location.pathname === "/admin/userManagement" ? "active" : ""
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4
          }`}
          onClick={() => navigate("/admin/userManagement")}
        >
          <FaUsers />
          {sidebarOpen && <span>Users</span>}
        </button>

<<<<<<< HEAD
        <button
          className={`nav-item ${location.pathname === "/admin/orderManagement" ? "active" : ""
            }`}
          onClick={() => {
            console.log("Orders Clicked");
            navigate("/admin/orderManagement");
          }}
        >
          <FaBoxOpen />
          {sidebarOpen && <span>Orders</span>}
        </button>
        <button
          className="nav-item"
          onClick={() => navigate("/admin/options")}
=======
        {/* <button
          className={`nav-item ${
            location.pathname === "/admin/products" ? "active" : ""
          }`}
          onClick={() => navigate("/admin/products")}
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4
        >
          <FaTags />
          {sidebarOpen && <span>Products</span>}
        </button> */}

        <button className="nav-item" onClick={() => navigate("/admin/options")}>
          <FaCog />
          {sidebarOpen && <span>Options</span>}
        </button>

        <div className="sidebar-dropdown">
  <button
    className={`nav-item ${
      location.pathname.includes("/admin/broadcast") ||
      location.pathname.includes("/admin/sentEmails")
        ? "active"
        : ""
    }`}
    onClick={() => setNotificationOpen(!notificationOpen)}
  >
    <FaBell />

    {sidebarOpen && (
      <>
        <span>Notifications</span>

        <span
          className={`dropdown-icon ${
            notificationOpen ? "rotate" : ""
          }`}
        >
          ▼
        </span>
      </>
    )}
  </button>

  {notificationOpen && sidebarOpen && (
    <div className="sidebar-submenu">
      <button
        className={`submenu-item ${
          location.pathname === "/admin/broadcast"
            ? "active"
            : ""
        }`}
        onClick={() => navigate("/admin/broadcast")}
      >
        Broadcast
      </button>

      <button
        className={`submenu-item ${
          location.pathname === "/admin/sent-emails"
            ? "active"
            : ""
        }`}
        onClick={() => navigate("/admin/sent-emails")}
      >
        Sent Emails
      </button>
    </div>
  )}
</div>

        <button className="nav-item logout-nav" onClick={handleLogout}>
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
<<<<<<< HEAD


=======
>>>>>>> c2d43ad618d0c43b469918ba4df4bcf89e7880b4
      </nav>
    </aside>
  );
}

export default AdminSidebar;
