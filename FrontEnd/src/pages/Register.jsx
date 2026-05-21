import React, { useState } from "react";
import "../App.css";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ToastContainer, toast }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { registerUser }
from "../services/authService";

// PNG ASSETS
import bag from "../assets/bag.png";
import cart from "../assets/cart.png";
import shoe from "../assets/shoe.png";
import gift from "../assets/gift.png";
import headphone from "../assets/headphone.png";
import perfume from "../assets/perfume.png";

function Register() {

  const [showPassword, setShowPassword] =
    useState(false);

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

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });
  };

  const handleImageChange = (e) => {

    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.username ||
      !form.name ||
      !form.password ||
      !form.email ||
      !form.mobileNumber ||
      !form.gender ||
      !form.address ||
      !form.dob
    ) {

      toast.warning(
        "Please Fill All Fields"
      );

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(

        "user",

        new Blob(
          [JSON.stringify(form)],
          {
            type: "application/json",
          }
        )
      );

      if (image) {

        formData.append("image", image);
      }

      const response =
        await registerUser(formData);

      toast.success(
        response.data.message ||
        "Registration Successful 🚀"
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

        error.response?.data ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="register-page">

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

      {/* GLOW */}
      <div className="bg-circle circle1"></div>

      <div className="bg-circle circle2"></div>

      <div className="bg-circle circle3"></div>

      {/* CARD */}
      <div className="register-card">

        {/* LOGO */}
        <div className="brand-logo">
          🛍️
        </div>

        {/* TITLE */}
        <h2 className="register-title">
          Create Account
        </h2>

        <p className="login-subtext">
          Join and start your shopping journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* USERNAME */}
            <input
              className="register-input"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            {/* FULL NAME */}
            <input
              className="register-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />

            {/* PASSWORD */}
            <div className="
              password-wrapper
              full-width
            ">

              <input
                className="
                  register-input
                  password-input
                "
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
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

            {/* EMAIL */}
            <input
              className="register-input"
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            {/* MOBILE */}
            <input
              className="register-input"
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={handleChange}
            />

            {/* GENDER */}
            <select
              className="register-input"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >

              <option value="">
                Select Gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

            {/* DOB */}
            <input
              className="register-input"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />

            {/* ADDRESS */}
            <textarea
              className="
                register-input
                register-textarea
                full-width
              "
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              rows="3"
            ></textarea>

            {/* IMAGE */}
            <div className="
              file-upload-wrapper
              full-width
            ">

              <label className="upload-label">
                Upload Profile Image
              </label>

              <label className="
                custom-file-upload
              ">

                {image
                  ? image.name
                  : "Choose Profile Image"}

                <input
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </label>

            </div>

            {/* BUTTON */}
            <button
              className="
                register-btn
                full-width
              "
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Registering..."
                : "Create Account →"}

            </button>

          </div>

        </form>

      </div>

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

    </div>
  );
}

export default Register;