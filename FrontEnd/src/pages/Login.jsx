import React, { useState } from "react";

import "../App.css";

import { ToastContainer }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import LoginForm
from "../components/auth/LoginForm";

import ForgotPassword
from "../components/auth/ForgotPassword";

import FloatingObjects
from "../components/auth/FloatingObjects";

import BackgroundEffects
from "../components/auth/BackgroundEffects";

function Login() {

  const [showForgot, setShowForgot] =
    useState(false);

  return (

    <div className="login-page">

      {/* FLOATING OBJECTS */}
      <FloatingObjects />

      {/* BACKGROUND GLOW */}
      <BackgroundEffects />

      {/* LOGIN CARD */}
      <div className="login-card">

        {/* LOGO */}
        <div className="brand-logo">
          🛒
        </div>

        {!showForgot ? (

          <LoginForm
            setShowForgot={setShowForgot}
          />

        ) : (

          <ForgotPassword
            setShowForgot={setShowForgot}
          />

        )}

      </div>

    </div>
  );
}

export default Login;