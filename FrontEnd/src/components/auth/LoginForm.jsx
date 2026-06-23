import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { GiThink } from "react-icons/gi";
import { RiLockPasswordFill } from "react-icons/ri";

import { loginUser } from "../../services/authService";
import {
  notifyAuthChange,
  normalizeRole,
  isAdminRole,
} from "../../hooks/useAuth";

import "../../styles/LoginIcon.css";

function LoginForm({ setShowForgot }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        username: username.trim(),
        password: password.trim(),
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      const token =
        data.token ||
        data.jwtToken ||
        data.accessToken;

      if (!token) {
        toast.error("Login failed: token not received from backend");
        return;
      }

      const backendRole =
        data.role ||
        data.user?.role ||
        data.roles?.[0] ||
        data.user?.roles?.[0] ||
        data.authorities?.[0]?.authority;

      const role = normalizeRole(backendRole);

      const userObj = {
        id: data.user?.id || data.id || null,
        username: data.user?.username || data.username || username,
        name:
          data.user?.name ||
          data.name ||
          data.user?.username ||
          data.username ||
          username,
        email: data.user?.email || data.email || "",
        role: role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "");
      localStorage.setItem("user", JSON.stringify(userObj));

      notifyAuthChange();

      toast.success("Login successful!");

      if (isAdminRole(role)) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="login-title">Shop Smarter With NextMart</h2>
      <p className="login-subtext">Sign in to continue your account</p>

      <form onSubmit={handleLogin}>
        <div className="input-box">
          <FaUser className="input-icon" />

          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="password-wrapper">
          <div className="input-box">
            <RiLockPasswordFill className="input-icon" />

            <input
              className="login-input password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <span
            className="eye-iconn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="login-spinner"></span>
              Logging in...
            </>
          ) : (
            "Login →"
          )}
        </button>

        <div className="input-boxx">
          <GiThink className="input-iconn" />

          <button
            className="secondary-btn"
            type="button"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginForm;