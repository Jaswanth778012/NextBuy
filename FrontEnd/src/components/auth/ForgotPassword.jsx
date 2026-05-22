import React, { useState } from "react";
import "../../styles/LoginIcon.css"
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/authService";
import { MdMarkEmailUnread } from "react-icons/md";
import { SiPronounsdotpage } from "react-icons/si";
import { RiLockPasswordLine } from "react-icons/ri";
import { PiPasswordFill } from "react-icons/pi";
import { GiConfirmed } from "react-icons/gi";

function ForgotPassword({ setShowForgot }) {

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // SEND OTP
  const handleForgotPassword = async () => {

    if (!email) {

      toast.warning(
        "Please Enter Email"
      );

      return;
    }

    try {

      const response =
        await forgotPassword(email);

      toast.success(response.data);

    } catch (error) {

      toast.error(
        "Your Email Is Not Registered"
      );
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {

    if (!otp) {

      toast.warning(
        "Please Enter OTP"
      );

      return;
    }

    try {

      const response =
        await verifyOtp(email, otp);

      toast.success(response.data);

      setOtpVerified(true);

    } catch (error) {

      toast.error("Invalid OTP");
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {

    if (newPassword !== confirmPassword) {

      toast.warning(
        "Passwords Do Not Match"
      );

      return;
    }

    try {

      const response =
        await resetPassword(
          email,
          newPassword,
          confirmPassword
        );

      toast.success(response.data);

      setShowForgot(false);

    } catch (error) {

      toast.error(
        "Password Reset Failed"
      );
    }
  };

  return (
    <>

      {!otpVerified ? (
        <>

          <h3 className="sub-title">
            Forgot Password
          </h3>
         <div className="input-box">
           <MdMarkEmailUnread className="input-icon" />
          <input
            className="login-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>
          <button
            className="login-btn"
            onClick={handleForgotPassword}
          >
            Send OTP 
          </button>
          <div className="input-box">
           <SiPronounsdotpage className="input-icon" />
          <input
            className="login-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />
          </div>
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

          {/* NEW PASSWORD */}

          <div className="password-wrapper">
           <div className="input-box">
           <RiLockPasswordLine className="input-icon" />
            <input
              className="
                login-input
                password-input
              "
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
           </div>
            <span
              className="eye-icon"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
            >
              {showNewPassword
                ? <FaEyeSlash />
                : <FaEye />}
            </span>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="password-wrapper">
            <div className="input-box">
           <GiConfirmed className="input-icon" />
            <input
              className="
                login-input
                password-input
              "
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
            </div>
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? <FaEyeSlash />
                : <FaEye />}
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
        onClick={() =>
          setShowForgot(false)
        }
      >
        Back To Login
      </button>

    </>
  );
}

export default ForgotPassword;