import React from "react";

import OptionsButtons
from "../components/adminOptions/OptionsButtons";

import "../styles/AdminOptions.css";
import { FaArrowLeft }
from "react-icons/fa";
import { useNavigate }
from "react-router-dom";

function AdminOptions() {
  const navigate = useNavigate();
  return (

    <div className="admin-options-page">

      <h1>
        Admin Options
      </h1>
      <p> View & manage customer accounts</p>

      <OptionsButtons />

    </div>
  );
}

export default AdminOptions;