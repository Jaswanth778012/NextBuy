import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FestivalBanner from "../components/adminFestival/FestivalBanner";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  }, [role, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Ecommerce 🛍️</h1>

        <p className="home-subtitle">
          Discover amazing products, exclusive offers, and festival special
          deals crafted just for you.
        </p>

        {!token ? (
          <button className="auth-btn" onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button className="auth-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className="festival-banner-wrapper">
        <FestivalBanner />
      </div>
    </div>
  );
}

export default Home;