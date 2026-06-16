import React from "react";
import { useNavigate } from "react-router-dom";
import FestivalBanner from "../components/adminFestival/FestivalBanner";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="home-container">

      <div className="home-header">

        <h1>Welcome to Ecommerce 🛍️</h1>

        <p className="home-subtitle">
          Discover amazing products, exclusive offers,
          and festival special deals crafted just for you.
        </p>

        {!token ? (
          <button
            className="auth-btn"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <button
            className="auth-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>

      {/* FESTIVAL BANNER */}
      
      {token && (
        <div className="festival-banner-wrapper">
          <h1>FESTIVAL BANNER</h1>
          <FestivalBanner />
        </div>
      )}

    </div>
  );
}

export default Home;