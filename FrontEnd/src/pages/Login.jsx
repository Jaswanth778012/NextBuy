import React, { useState } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      toast.success("Login Successful 🚀");
    } catch (error) {
      console.error(error);
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
      console.error(error);
      toast.error("Failed To Send OTP");
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
      console.error(error);
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
      const response = await resetPassword(email, newPassword, confirmPassword);
      toast.success(response.data);

      // RESET STATES
      setShowForgot(false);
      setOtpVerified(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Password Reset Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {!showForgot ? (
          <>
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin}>
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

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

                <button className="login-btn" onClick={handleForgotPassword}>
                  Send OTP
                </button>

                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button className="login-btn" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <h3 className="sub-title">Reset Password</h3>
                <input
                  className="login-input"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  className="login-input"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="login-btn" onClick={handleResetPassword}>
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

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}

export default Login;