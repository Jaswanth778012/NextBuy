import React, { useState, useRef, useEffect } from "react";
import NestBuy from "../../assets/NestBuy.png"
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import SearchDropdown from "./SearchDropdown";
import {
  getAdminProfile,
} from "../../services/adminService";
import { useNavigate }
from "react-router-dom";

function AdminHeader({
  searchKeyword,
  handleGlobalSearch,
  searchResults,
  setSelectedResult,
  setSelectedType,
  setSearchResults,
  setSearchKeyword,
  theme,
  toggleTheme,
}) {

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profile, setProfile] =
  useState({
    name: "",
    dpUrl: "",
  });

  const profileRef = useRef();
  const navigate = useNavigate();

  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  
// FETCH PROFILE
useEffect(() => {

  const fetchProfile =
    async () => {

      try {

        const response =
          await getAdminProfile();

        setProfile({
          name:
            response.data.Username,

          dpUrl:
            response.data.dpUrl,
        });

      } catch (error) {

        console.log(
          "Profile fetch error",
          error
        );
      }
    };

  fetchProfile();

}, []);

  return (
    <header className="admin-header">

      {/* LEFT LOGO */}
      <div className="company-logo">
        <img src={NestBuy} alt="company-logo" />
      </div>

      {/* CENTER SEARCH */}
      <div className="header-center">
        <div className="search-container">

          <div className="search-box">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search users, products, brands..."
              value={searchKeyword}
              onChange={handleGlobalSearch}
            />
          </div>

          <SearchDropdown
            searchResults={searchResults}
            setSelectedResult={setSelectedResult}
            setSelectedType={setSelectedType}
            setSearchResults={setSearchResults}
            setSearchKeyword={setSearchKeyword}
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="header-right">

        {/* THEME BUTTON */}
        <button
          className="header-icon theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {/* NOTIFICATION */}
        <button className="header-icon notification">
          <FaBell />
          <span className="dot"></span>
        </button>

        {/* PROFILE */}
        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <div
            className="profile-box"
            onClick={() =>
              setShowProfileMenu(!showProfileMenu)
            }
          >
            <img
              src={profile.dpUrl || "/default-avatar.png"}
  alt="Profile"
             
            />

            <span>
     {profile.name }
     </span>

            <FaChevronDown
              className={`dropdown-arrow ${
                showProfileMenu ? "rotate" : ""
              }`}
            />
          </div>

          {/* DROPDOWN */}
          {showProfileMenu && (
            <div className="profile-dropdown">

             <button
  className="dropdown-item"
  onClick={() =>
    navigate("/admin/profile")
  }
>
  <FaUser />
  My Profile
</button>

              
             

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default AdminHeader;