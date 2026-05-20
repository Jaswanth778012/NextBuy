import React, { useState } from "react";
import { registerUser } from "../services/authService";
import "../App.css";
function Register() {

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

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append(
        "user",
        new Blob(
          [JSON.stringify(form)],
          { type: "application/json" }
        )
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await registerUser(formData);

      alert(response.data.message);

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

    // RESET IMAGE
    setImage(null);

    } catch (error) {

      console.error(error);
      alert("Registration Failed");
    }
  };

  return (

  <div className="register-page">

    <div className="register-card">

      

      <h2 className="register-title">
        Create Account
      </h2>

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

        <input
          className="register-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

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
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button
          className="register-btn"
          type="submit"
        >
          Register
        </button>

      </form>

    </div>

  </div>
);
}

export default Register;