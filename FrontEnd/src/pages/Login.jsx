import React, { useState } from "react";
import "../App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../services/authService";

// PNG ASSETS
import bag from "../assets/bag.png";
import cart from "../assets/cart.png";
import shoe from "../assets/shoe.png";
import gift from "../assets/gift.png";
import headphone from "../assets/headphone.png";
import perfume from "../assets/perfume.png";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showForgot, setShowForgot] = useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

    const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await loginUser({
        username,
        password,
      });

      const role = response.data.role;

console.log("ROLE =", role);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      toast.success("Login Successful 🚀");

      setTimeout(() => {

      if (role === "ADMIN") {

        navigate("/admin/dashboard");

      } else if (role === "USER") {

        navigate("/");

      }

    }, 1200);

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

      {/* FLOATING OBJECTS */}
      <div className="floating-objects">

        <img
          src={bag}
          alt=""
          className="floating-item bag1"
        />

        <img
          src={cart}
          alt=""
          className="floating-item cart"
        />

        <img
          src={shoe}
          alt=""
          className="floating-item shoe"
        />

        <img
          src={gift}
          alt=""
          className="floating-item gift"
        />

        <img
          src={headphone}
          alt=""
          className="floating-item headphone"
        />

        <img
          src={perfume}
          alt=""
          className="floating-item perfume"
        />

      </div>

      {/* GLOW CIRCLES */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      <div className="login-card">

        <div className="brand-logo">
          🛒
        </div>

        {!showForgot ? (
          <>
            <h2 className="login-title">
              Welcome Back
            </h2>

            <p className="login-subtext">
              Sign in to continue your account
            </p>

            <form onSubmit={handleLogin}>

              <input
                className="login-input"
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

              <div className="password-wrapper">

                <input
                  className="login-input password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

              <button
                className="login-btn"
                type="submit"
              >
                Login →
              </button>

              <button
                className="secondary-btn"
                type="button"
                onClick={() =>
                  setShowForgot(true)
                }
              >
                Forgot Password?
              </button>

            </form>
          </>
        ) : (
          <>
            {!otpVerified ? (
              <>
                <h3 className="sub-title">
                  Forgot Password
                </h3>

                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
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
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
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
                <h3 className="sub-title">
                  Reset Password
                </h3>

                <div className="password-wrapper">

                  <input
                    className="login-input password-input"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                  >
                    {showNewPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>

                </div>

                <div className="password-wrapper">

                  <input
                    className="login-input password-input"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
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