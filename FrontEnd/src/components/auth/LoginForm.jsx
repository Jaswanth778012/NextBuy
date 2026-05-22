import React, { useState } from "react";
import "../../styles/LoginIcon.css"
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FaRotateRight } from "react-icons/fa6";
import { GiThink } from "react-icons/gi";

import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate }
from "react-router-dom";

import { loginUser }
from "../../services/authService";

function LoginForm({ setShowForgot }) {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await loginUser({
        username,
        password,
      });

      const role = response.data.role;

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        role
      );

      toast.success(
        "Login Successful 🚀"
      );

      setTimeout(() => {

        if (role === "ADMIN") {

          navigate("/admin/dashboard");

        } else {

          navigate("/");
        }

      }, 1200);

    } catch (error) {

      toast.error("Invalid Credentials");
    }
  };

  return (
    <>

      <h2 className="login-title">
           Shop Smarter With NextBuy
      </h2>

      <p className="login-subtext">
        Sign in to continue your account
      </p>

      <form onSubmit={handleLogin}>
       <div className="input-box">
         <FaUser className="input-icon" />
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />
</div>
        <div className="password-wrapper">
         <div className="input-box">
           <RiLockPasswordFill className="input-icon" />
          <input
            className="
              login-input
              password-input
            "
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
        </div>
          <span
            className="eye-icon"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            {showPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </span>

        </div>

        <button
          className="login-btn"
          type="submit"
        >
          Login →
        </button>
        <div className="input-boxx">
           <GiThink className="input-iconn" />
        <button
          className="secondary-btn"
          type="button"
          onClick={() =>
            setShowForgot(true)
          }
        >
          Forgot Password?
        </button>
         </div>
      </form>
    </>
  );
}

export default LoginForm;