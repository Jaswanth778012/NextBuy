// ===============================
// LOGIN.JSX
// ===============================

import React, { useState } from "react";
import "../App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaEye,
  FaEyeSlash,
  FaShoppingCart,
  FaBoxOpen,
  FaGift,
  FaHeart,
} from "react-icons/fa";

import {
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../services/authService";

function Login() {
  // LOGIN STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // PASSWORD VISIBILITY
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // FORGOT PASSWORD STATES
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI STATES
  const [showForgot, setShowForgot] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      toast.success("Login Successful 🚀");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  // SEND OTP
  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Please Enter Email");
      return;
    }

    try {
      const response = await forgotPassword(email);
      toast.success(response.data);
    } catch (error) {
      toast.error("Your Email Is Not Registered");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please Enter OTP");
      return;
    }

    try {
      const response = await verifyOtp(email, otp);
      toast.success(response.data);
      setOtpVerified(true);
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning("Passwords Do Not Match");
      return;
    }

    try {
      const response = await resetPassword(
        email,
        newPassword,
        confirmPassword
      );

      toast.success(response.data);

      setShowForgot(false);
      setOtpVerified(false);

      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Password Reset Failed");
    }
  };

  return (
    <div className="login-page">

      {/* FLOATING ICONS */}
      <div className="floating-icons">
        <FaShoppingCart className="float-icon icon1" />
        <FaBoxOpen className="float-icon icon2" />
        <FaGift className="float-icon icon3" />
        <FaHeart className="float-icon icon4" />
      </div>

      {/* GLOW CIRCLES */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      <div className="login-card">

        <div className="brand-logo">
          🛍️
        </div>

        {!showForgot ? (
          <>
            <h2 className="login-title">Welcome Back</h2>

            <p className="login-subtext">
              Login to continue your shopping journey
            </p>

            <form onSubmit={handleLogin}>

              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* PASSWORD FIELD */}
              <div className="password-wrapper">

                <input
                  className="login-input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>

              <button className="login-btn" type="submit">
                Login
              </button>

              <button
                className="secondary-btn"
                type="button"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>

            </form>
          </>
        ) : (
          <>
            {!otpVerified ? (
              <>
                <h3 className="sub-title">Forgot Password</h3>

                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="login-btn"
                  onClick={handleForgotPassword}
                >
                  Send OTP
                </button>

                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="login-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <h3 className="sub-title">Reset Password</h3>

                {/* NEW PASSWORD */}
                <div className="password-wrapper">

                  <input
                    className="login-input password-input"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>

                </div>

                {/* CONFIRM PASSWORD */}
                <div className="password-wrapper">

                  <input
                    className="login-input password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>

                </div>

                <button
                  className="login-btn"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
              </>
            )}

            <button
              className="secondary-btn"
              onClick={() => {
                setShowForgot(false);
                setOtpVerified(false);

                setEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Back To Login
            </button>
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </div>
  );
}

export default Login;