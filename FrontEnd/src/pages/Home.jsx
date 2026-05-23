import React from "react";

import { useNavigate }
from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  // CHECK TOKEN
  const token =
    localStorage.getItem("token");

  // LOGIN BUTTON
  const handleLogin = () => {

    navigate("/login");
  };

  // LOGOUT BUTTON
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");
  };

  return (

    <div className="home-container">

      <h1>
        Welcome to Ecommerce 🛍️
      </h1>

      {/* IF NOT LOGGED IN */}
      {!token ? (

        <button
          className="auth-btn"
          onClick={handleLogin}
        >
          Login
        </button>

      ) : (

        /* IF LOGGED IN */
        <button
          className="auth-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      )}

    </div>
  );
}

export default Home;