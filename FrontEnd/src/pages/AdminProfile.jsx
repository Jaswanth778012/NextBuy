import React,
{
  useEffect,
  useState,
} from "react";

import {

  getAdminProfile,

  editAdminProfile,

  changeAdminPassword,

} from "../services/adminService";

import ProfileSidebar
from "../components/adminProfile/ProfileSidebar";

import ProfileInfo
from "../components/adminProfile/ProfileInfo";

import EditProfilePopup
from "../components/adminProfile/EditProfilePopup";

import ChangePasswordPopup
from "../components/adminProfile/ChangePasswordPopup";

function AdminProfile() {

  // PROFILE
  const [profile,
  setProfile] =
  useState(null);

  // EDIT POPUP
  const [showEditPopup,
  setShowEditPopup] =
  useState(false);

  // PASSWORD POPUP
  const [showPasswordPopup,
  setShowPasswordPopup] =
  useState(false);

  // IMAGE
  const [selectedImage,
  setSelectedImage] =
  useState(null);

  // EDIT FORM
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

  // PASSWORD FORM
  const [passwordForm,
  setPasswordForm] =
  useState({

    username: "",

    oldPassword: "",

    newPassword: "",

    confirmPassword: "",
  });

  // FETCH PROFILE
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

  // HANDLE INPUT
  const handleChange =
    (e) => {

      setEditForm({

        ...editForm,

        [e.target.name]:
        e.target.value,
      });
  };

  // HANDLE PASSWORD INPUT
  const handlePasswordChange =
    (e) => {

      setPasswordForm({

        ...passwordForm,

        [e.target.name]:
        e.target.value,
      });
  };

  // HANDLE IMAGE
  const handleImageChange =
    (e) => {

      setSelectedImage(
        e.target.files[0]
      );
  };

  // SAVE PROFILE
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
              )
            ],

            {
              type:
              "application/json"
            }
          )
        );

        if(selectedImage){

          formData.append(
            "img",
            selectedImage
          );
        }

        const response =
          await editAdminProfile(
            formData
          );

        console.log(response);

        setProfile({

          ...editForm,

          dpUrl:
            selectedImage
              ? URL.createObjectURL(
                  selectedImage
                )
              : profile.dpUrl
        });

        setSelectedImage(null);

        setShowEditPopup(false);

        alert(
          "Profile Updated"
        );

      } catch (error) {

        console.log(error);
      }
  };

  // VERIFY PASSWORD
  const handleVerifyPassword =
    async () => {

      try {

        await changeAdminPassword(

          passwordForm.username,

          passwordForm.oldPassword,

          passwordForm.oldPassword
        );

        alert(
          "Verified Successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Wrong Username or Password"
        );
      }
  };

  // UPDATE PASSWORD
  const handlePasswordSave =
    async () => {

      try {

        if(

          passwordForm.newPassword !==
          passwordForm.confirmPassword

        ){

          alert(
            "Passwords Not Matching"
          );

          return;
        }

        const response =
          await changeAdminPassword(

            passwordForm.username,

            passwordForm.oldPassword,

            passwordForm.newPassword
          );

        console.log(response);

        alert(
          "Password Updated"
        );

        setShowPasswordPopup(false);

        setPasswordForm({

          username: "",

          oldPassword: "",

          newPassword: "",

          confirmPassword: "",
        });

      } catch (error) {

        console.log(error);

        alert(
          "Password Update Failed"
        );
      }
  };

  // LOADING
  if (!profile) {

    return <h2>Loading...</h2>;
  }

  return (

    <div className="admin-profile-container">

      {/* SIDEBAR */}
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

      {/* EDIT POPUP */}
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