import React, { useState } from "react";


import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaTags,
  FaCog,
  FaBell,
  FaTicketAlt,
  FaImages,
} from "react-icons/fa";



import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [productOpen, setProductOpen] =
    useState(
      location.pathname.includes(
        "/admin/productManagement"
      ) ||
        location.pathname.includes(
          "/admin/categoryManagement"
        ) ||
        location.pathname.includes(
          "/admin/subCategoryManagement"
        ) ||
        location.pathname.includes(
          "/admin/brandManagement"
        )
    );

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(
    location.pathname.includes(
      "/admin/broadcast"
    ) ||
      location.pathname.includes(
        "/admin/sent-emails"
      )
  );

  return (
    <aside
      className={`admin-sidebar ${
        sidebarOpen
          ? "open"
          : "closed"
      }`}
    >
      <div
        className="sidebar-toggle-arrow"
        onClick={() =>
          setSidebarOpen(
            !sidebarOpen
          )
        }
      >
        {sidebarOpen
          ? "‹"
          : "›"}
      </div>

      <div className="sidebar-logo">
        <h2>
          {sidebarOpen
            ? "NestBuy"
            : "NB"}
        </h2>
      </div>

      <nav className="sidebar-nav">

        {/* DASHBOARD */}

        <button
          className={`nav-item ${
            location.pathname ===
            "/admin/dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <FaTachometerAlt />
          {sidebarOpen && (
            <span>
              Dashboard
            </span>
          )}
        </button>

        {/* USERS */}

        <button
          className={`nav-item ${
            location.pathname ===
            "/admin/userManagement"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/userManagement"
            )
          }
        >
          <FaUsers />
          {sidebarOpen && (
            <span>Users</span>
          )}
        </button>

        {/* PRODUCTS DROPDOWN */}

        <div className="sidebar-dropdown">
          <button
            className={`nav-item ${
              location.pathname.includes(
                "/admin/productManagement"
              ) ||
              location.pathname.includes(
                "/admin/categoryManagement"
              ) ||
              location.pathname.includes(
                "/admin/subCategoryManagement"
              ) ||
              location.pathname.includes(
                "/admin/brandManagement"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              setProductOpen(
                !productOpen
              )
            }
          >
            <FaTags />

            {sidebarOpen && (
              <>
                <span>
                  Products
                </span>

                <span
                  className={`dropdown-icon ${
                    productOpen
                      ? "rotate"
                      : ""
                  }`}
                >
                  ▲
                </span>
              </>
            )}
          </button>

          {productOpen &&
            sidebarOpen && (
              <div className="sidebar-submenu">

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/productManagement"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/productManagement"
                    )
                  }
                >
                  Products
                </button>

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/categoryManagement"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/categoryManagement"
                    )
                  }
                >
                  Categories
                </button>

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/subCategoryManagement"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/subCategoryManagement"
                    )
                  }
                >
                  Sub Categories
                </button>

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/brandManagement"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/brandManagement"
                    )
                  }
                >
                  Brands
                </button>

              </div>
            )}
        </div>

        {/* FESTIVAL BANNERS */}

<button
  className={`nav-item ${
    location.pathname ===
    "/admin/festivalBannerManagement"
      ? "active"
      : ""
  }`}
  onClick={() =>
    navigate(
      "/admin/festivalBannerManagement"
    )
  }
>
  <FaImages />
  {sidebarOpen && (
    <span>
      Festival Banners
    </span>
  )}
</button>

        {/* ORDERS */}

        <button
          className={`nav-item ${
            location.pathname ===
            "/admin/orderManagement"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/orderManagement"
            )
          }
        >
          <FaBoxOpen />
          {sidebarOpen && (
            <span>
              Orders
            </span>
          )}
        </button>

        <button className={`nav-item ${ location.pathname === "/admin/couponManagement" ? "active" : "" }`} onClick={() => navigate( "/admin/couponManagement" ) } > <FaTicketAlt /> {sidebarOpen && ( <span> Coupons </span> )} </button>

        {/* OPTIONS */}

        <button
          className={`nav-item ${
            location.pathname ===
            "/admin/options"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/options"
            )
          }
        >
          <FaCog />
          {sidebarOpen && (
            <span>
              Options
            </span>
          )}
        </button>

        {/* NOTIFICATIONS */}

        <div className="sidebar-dropdown">
          <button
            className={`nav-item ${
              location.pathname.includes(
                "/admin/broadcast"
              ) ||
              location.pathname.includes(
                "/admin/sent-emails"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              setNotificationOpen(
                !notificationOpen
              )
            }
          >
            <FaBell />

            {sidebarOpen && (
              <>
                <span>
                  Notifications
                </span>

                <span
                  className={`dropdown-icon ${
                    notificationOpen
                      ? "rotate"
                      : ""
                  }`}
                >
                  ▲
                </span>
              </>
            )}
          </button>

          {notificationOpen &&
            sidebarOpen && (
              <div className="sidebar-submenu">

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/broadcast"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/broadcast"
                    )
                  }
                >
                  Broadcast
                </button>

                <button
                  className={`submenu-item ${
                    location.pathname ===
                    "/admin/sent-emails"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      "/admin/sent-emails"
                    )
                  }
                >
                  Sent Emails
                </button>

              </div>
            )}
        </div>

        {/* LOGOUT */}

        <button
          className="nav-item logout-nav"
          onClick={
            handleLogout
          }
        >
          <FaSignOutAlt />
          {sidebarOpen && (
            <span>
              Logout
            </span>
          )}
        </button>

      </nav>
    </aside>
  );
}

export default AdminSidebar;