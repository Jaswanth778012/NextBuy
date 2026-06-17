import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GiThink } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { loginUser } from "../../services/authService";
import { notifyAuthChange } from "../../hooks/useAuth";
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
      const role = data.role;

      // ✅ Store token
      localStorage.setItem("token", data.token);

      // ✅ Store role
      localStorage.setItem("role", role);

      // ✅ CRITICAL FIX: Store user object so useAuth.js works
      const userObj = data.user || {
        username: data.username || username,
        role: role,
        email: data.email,
        name: data.name || data.username || username,
      };
      localStorage.setItem("user", JSON.stringify(userObj));

      // ✅ Notify all auth listeners (Header, etc.)
      notifyAuthChange();

      toast.success("Login successful!");

      // Navigate based on role
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Invalid Credentials");
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