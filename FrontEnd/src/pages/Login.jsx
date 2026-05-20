import React, { useState } from "react";

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

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      alert("Login Successful 🚀");

    } catch (error) {

      console.error(error);
      alert("Invalid Credentials");
    }
  };

  // SEND OTP
  const handleForgotPassword = async () => {

    try {

      const response =
        await forgotPassword(email);

      alert(response.data.message);

    } catch (error) {

      console.error(error);
      alert("Failed To Send OTP");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {

    try {

      const response =
        await verifyOtp(email, otp);

      alert(response.data.message);

      setOtpVerified(true);

    } catch (error) {

      console.error(error);
      alert("Invalid OTP");
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {

    try {

      const response =
        await resetPassword(
          email,
          newPassword,
          confirmPassword
        );

      alert(response.data.message);

      setShowForgot(false);

      setOtpVerified(false);

    } catch (error) {

      console.error(error);
      alert("Password Reset Failed");
    }
  };

  return (

    <div>

      <h2>Login</h2>

      {!showForgot ? (

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <br /><br />

          <button type="submit">
            Login
          </button>

          <br /><br />

          <button
            type="button"
            onClick={() =>
              setShowForgot(true)
            }
          >
            Forgot Password?
          </button>

        </form>

      ) : (

        <div>

          <h3>Forgot Password</h3>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <br /><br />

          <button
            onClick={handleForgotPassword}
          >
            Send OTP
          </button>

          <br /><br />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          <br /><br />

          <button
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>

          <br /><br />

          {otpVerified && (

            <div>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              <br /><br />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <br /><br />

              <button
                onClick={handleResetPassword}
              >
                Reset Password
              </button>

            </div>
          )}

          <br /><br />

          <button
            onClick={() =>
              setShowForgot(false)
            }
          >
            Back To Login
          </button>

        </div>
      )}

    </div>
  );
}

export default Login;