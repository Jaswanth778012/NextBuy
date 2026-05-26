// import React from "react";

// import { FaSearch, FaBell, FaMoon, FaSun } from "react-icons/fa";

// import SearchDropdown from "./SearchDropdown";

// function AdminHeader({
//   searchKeyword,
//   handleGlobalSearch,
//   searchResults,
//   setSelectedResult,
//   setSelectedType,
//   setSearchResults,
//   setSearchKeyword,
//   theme,
//   toggleTheme,
// }) {
//   return (
//     <header className="admin-header">
//       {/* LEFT LOGO */}
//       <div className="company-logo">
//         <img src="/logo.png" alt="company-logo" />
//       </div>

//       {/* CENTER SEARCH */}
//       <div className="header-center">
//         <div className="search-container">
//           <div className="search-box">
//             <FaSearch className="search-icon" />

//             <input
//               type="text"
//               placeholder="Search users, products, brands..."
//               value={searchKeyword}
//               onChange={handleGlobalSearch}
//             />
//           </div>

//           <SearchDropdown
//             searchResults={searchResults}
//             setSelectedResult={setSelectedResult}
//             setSelectedType={setSelectedType}
//             setSearchResults={setSearchResults}
//             setSearchKeyword={setSearchKeyword}
//           />
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="header-right">
//         <button
//           className="header-icon theme-toggle"
//           onClick={toggleTheme}
//           aria-label="Toggle dark mode"
//         >
//           {theme === "light" ? <FaMoon /> : <FaSun />}
//         </button>

//         <button className="header-icon notification">
//           <FaBell />
//           <span className="dot"></span>
//         </button>

//         <div className="profile-box">
//           <img src="https://i.pravatar.cc/100" alt="profile" />
//           <span>Musharof</span>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default AdminHeader;

import React, { useState, useRef, useEffect } from "react";

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

  const profileRef = useRef();

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

  return (
    <header className="admin-header">

      {/* LEFT LOGO */}
      <div className="company-logo">
        <img src="/logo.png" alt="company-logo" />
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
              src="https://i.pravatar.cc/100"
              alt="profile"
            />

            <span>Musharof</span>

            <FaChevronDown
              className={`dropdown-arrow ${
                showProfileMenu ? "rotate" : ""
              }`}
            />
          </div>

          {/* DROPDOWN */}
          {showProfileMenu && (
            <div className="profile-dropdown">

              <button className="dropdown-item">
                <FaUser />
                My Profile
              </button>

              <button className="dropdown-item">
                <FaCog />
                Settings
              </button>

              <button className="dropdown-item logout-item">
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default AdminHeader;