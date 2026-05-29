import React from "react";

import "../App.css";

import { ToastContainer }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import RegisterForm
from "../components/auth/RegisterForm";

import FloatingObjects
from "../components/auth/FloatingObjects";

import BackgroundEffects
from "../components/auth/BackgroundEffects";

function Register() {

  return (

    <div className="register-page">

      {/* FLOATING OBJECTS */}
      <FloatingObjects />

      {/* GLOW EFFECTS */}
      <BackgroundEffects />

      {/* CARD */}
      <div className="register-card">

        {/* LOGO */}
        <div className="brand-logo">
          🛍️
        </div>

        {/* TITLE */}
        <h2 className="register-title">
          Create Account
        </h2>

        <p className="login-subtext">
          Join and start your shopping journey
        </p>

        {/* FORM */}
        <RegisterForm />

      </div>

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

    </div>
  );
}

export default Register;