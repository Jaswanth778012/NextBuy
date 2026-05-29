import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {

  getAdminProfile,

  editAdminProfile,

  changeAdminPassword,

} from "../services/adminService";

import ProfileInfo
from "../components/adminProfile/ProfileInfo";

import ProfileSidebar
from "../components/adminProfile/ProfileSidebar";

import EditProfilePopup
from "../components/adminProfile/EditProfilePopup";

import ChangePasswordPopup
from "../components/adminProfile/ChangePasswordPopup";

import "../styles/AdminProfile.css";

function AdminProfile() {

  const navigate =
    useNavigate();

  // =========================
  // PROFILE
  // =========================

  const [profile,
    setProfile] =
    useState(null);

  // =========================
  // POPUPS
  // =========================

  const [showEditPopup,
    setShowEditPopup] =
    useState(false);

  const [showPasswordPopup,
    setShowPasswordPopup] =
    useState(false);

  // =========================
  // IMAGE
  // =========================

  const [selectedImage,
    setSelectedImage] =
    useState(null);

  // =========================
  // EDIT FORM
  // =========================

  const [editForm,
    setEditForm] =
    useState({

      name: "",

      mobileNumber: "",

      addressLine1: "",

      city: "",

      state: "",

      country: "",

      email: "",
    });

  // =========================
  // PASSWORD FORM
  // =========================

  const [passwordForm,
    setPasswordForm] =
    useState({

      username: "",

      oldPassword: "",

      newPassword: "",

      confirmPassword: "",
    });

  // =========================
  // AUTH CHECK
  // =========================

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      navigate("/login");
    }

  }, [navigate]);

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile =
    async () => {

      try {

        const response =
          await getAdminProfile();

        setProfile(
          response.data
        );

        setEditForm(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange =
    (e) => {

      setEditForm({

        ...editForm,

        [e.target.name]:
          e.target.value,
      });
  };

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePasswordChange =
    (e) => {

      setPasswordForm({

        ...passwordForm,

        [e.target.name]:
          e.target.value,
      });
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange =
    (e) => {

      setSelectedImage(
        e.target.files[0]
      );
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave =
    async () => {

      try {

        const formData =
          new FormData();

        formData.append(

          "profile",

          new Blob(
            [
              JSON.stringify(
                editForm
              ),
            ],

            {
              type:
                "application/json",
            }
          )
        );

        if (selectedImage) {

          formData.append(
            "img",
            selectedImage
          );
        }

        await editAdminProfile(
          formData
        );

        setProfile({

          ...editForm,

          dpUrl:
            selectedImage
              ? URL.createObjectURL(
                  selectedImage
                )
              : profile.dpUrl,
        });

        setSelectedImage(
          null
        );

        setShowEditPopup(
          false
        );

        alert(
          "Profile Updated Successfully 🚀"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Profile Update Failed ❌"
        );
      }
  };

  // =========================
  // VERIFY PASSWORD
  // =========================

  const handleVerifyPassword =
    async () => {

      try {

        await changeAdminPassword(

          passwordForm.username,

          passwordForm.oldPassword,

          passwordForm.oldPassword
        );

        alert(
          "Verified Successfully ✅"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Wrong Username or Password ❌"
        );
      }
  };

  // =========================
  // UPDATE PASSWORD
  // =========================

  const handlePasswordSave =
    async () => {

      try {

        if (

          passwordForm.newPassword !==

          passwordForm.confirmPassword

        ) {

          alert(
            "Passwords Not Matching ❌"
          );

          return;
        }

        await changeAdminPassword(

          passwordForm.username,

          passwordForm.oldPassword,

          passwordForm.newPassword
        );

        alert(
          "Password Updated Successfully 🔐"
        );

        setShowPasswordPopup(
          false
        );

        setPasswordForm({

          username: "",

          oldPassword: "",

          newPassword: "",

          confirmPassword: "",
        });

      } catch (error) {

        console.log(error);

        alert(
          "Password Update Failed ❌"
        );
      }
  };

  // =========================
  // LOADING
  // =========================

  if (!profile) {

    return (

      <div className="admin-profile-page">

        <div className="dashboard-status-card">

          <div className="dashboard-loader"></div>

          <h2>
            Loading Profile
          </h2>

          <p>
            Fetching admin details...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (

    <div className="admin-profile-page">

      <div className="admin-profile-container">

        {/* PROFILE SIDEBAR */}

        <ProfileSidebar

          profile={profile}

          setShowEditPopup={
            setShowEditPopup
          }

          setShowPasswordPopup={
            setShowPasswordPopup
          }
        />

        {/* PROFILE INFO */}

        <ProfileInfo
          profile={profile}
        />

      </div>

      {/* EDIT PROFILE POPUP */}

      {showEditPopup && (

        <EditProfilePopup

          editForm={editForm}

          handleChange={
            handleChange
          }

          handleImageChange={
            handleImageChange
          }

          handleSave={
            handleSave
          }

          setShowEditPopup={
            setShowEditPopup
          }
        />
      )}

      {/* PASSWORD POPUP */}

      {showPasswordPopup && (

        <ChangePasswordPopup

          passwordForm={
            passwordForm
          }

          handlePasswordChange={
            handlePasswordChange
          }

          handlePasswordSave={
            handlePasswordSave
          }

          handleVerifyPassword={
            handleVerifyPassword
          }

          setShowPasswordPopup={
            setShowPasswordPopup
          }
        />
      )}

    </div>
  );
}

export default AdminProfile;