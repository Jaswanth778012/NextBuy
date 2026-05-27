import React from "react";

import {
  FaUserEdit,
  FaLongArrowAltLeft,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

function ProfileSidebar({

  profile,

  setShowEditPopup,

  setShowPasswordPopup,

}) {

  const navigate =
    useNavigate();

  return (

    <div className="profile-sidebar">

      <img
        src={
          profile.dpUrl
            ? profile.dpUrl
            : "https://i.pravatar.cc/150"
        }
        alt="profile"
      />

      <h2>
        {profile.name}
      </h2>

      <p>
        Administrator
      </p>

      <div className="profile-btn-group">

        <button
          className="edit-profile-btn"
          onClick={() =>
            setShowEditPopup(true)
          }
        >

          <FaUserEdit />

          Edit Profile

        </button>

        <button
          className="change-password-btn"
          onClick={() =>
            setShowPasswordPopup(true)
          }
        >

          Change Password

        </button>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >

          <FaLongArrowAltLeft />

          Back To Board

        </button>

      </div>

    </div>
  );
}

export default ProfileSidebar;