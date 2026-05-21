

import React, { useState } from "react";
import "../App.css";

import {
  FaShoppingBag,
  FaCartPlus,
  FaHeart,
  FaGift,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { registerUser } from "../services/authService";

function Register() {

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    mobileNumber: "",
    email: "",
    gender: "",
    address: "",
    dob: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.name ||
      !form.password ||
      !form.email
    ) {
      toast.warning("Please Fill Required Fields");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "user",
        new Blob([JSON.stringify(form)], {
          type: "application/json",
        })
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await registerUser(formData);

      toast.success(
        response.data.message || "Registration Successful 🚀"
      );

      setForm({
        username: "",
        name: "",
        password: "",
        mobileNumber: "",
        email: "",
        gender: "",
        address: "",
        dob: "",
      });

      setImage(null);

    } catch (error) {

      toast.error(
        error.response?.data || "Registration Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* FLOATING ICONS */}
      <div className="floating-icons">
        <FaShoppingBag className="float-icon icon1" />
        <FaCartPlus className="float-icon icon2" />
        <FaHeart className="float-icon icon3" />
        <FaGift className="float-icon icon4" />
      </div>

      {/* GLOW */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      <div className="register-card">

        <div className="brand-logo">
          🛒
        </div>

        <h2 className="register-title">
          Create Account
        </h2>

        <p className="login-subtext">
          Join and start your shopping adventure
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="register-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            className="register-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="password-wrapper">

            <input
              className="register-input password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>

          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="register-input"
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
          />

          <select
            className="register-select"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            className="register-input"
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            className="register-input"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <input
            className="file-input"
            type="file"
            onChange={handleImageChange}
          />

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </div>
  );
}

export default Register;