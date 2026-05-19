import React, { useState } from "react";
import { registerUser } from "../services/authService";

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

      const response =
        await registerUser(formData);

      alert(response.data.message);

    } catch (error) {

      console.error(error);
      alert("Registration Failed");
    }
  };

  return (

    <div>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;