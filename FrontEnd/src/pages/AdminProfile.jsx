import React,
{
  useEffect,
  useState,
} from "react";

import {
  FaUserEdit,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {

  getAdminProfile,

  editAdminProfile,

  changeAdminPassword,

} from "../services/adminService";

function AdminProfile() {

  const [profile, setProfile] =
    useState(null);

  const [showEditPopup,
  setShowEditPopup] =
  useState(false);

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

  const [selectedImage,
  setSelectedImage] =
  useState(null);

  // PASSWORD STATES
  const [showPasswordPopup,
  setShowPasswordPopup] =
  useState(false);

  const [isVerified,
  setIsVerified] =
  useState(false);

  const [showOldPassword,
setShowOldPassword] =
useState(false);

const [showNewPassword,
setShowNewPassword] =
useState(false);

const [showConfirmPassword,
setShowConfirmPassword] =
useState(false);

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

    fetchProfile();

  }, []);

  // HANDLE INPUT
  const handleChange =
    (e) => {

      setEditForm({

        ...editForm,

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

  // HANDLE PASSWORD INPUT
  const handlePasswordChange =
    (e) => {

      setPasswordForm({

        ...passwordForm,

        [e.target.name]:
        e.target.value,
      });
  };

  // SAVE PROFILE
  const handleSave =
    async () => {

      try {

        const formData =
          new FormData();

        // JSON DATA
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

        // IMAGE FILE
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

        setIsVerified(true);

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

        setIsVerified(false);

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

  if (!profile) {

    return <h2>Loading...</h2>;
  }

  return (

    <div className="admin-profile-container">

      {/* LEFT SIDEBAR */}
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

        </div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-content-area">

        <div className="profile-section">

          <h3>
            Personal Information
          </h3>

          <div className="profile-grid">

            <div className="profile-item">

              <label>
                Full Name
              </label>

              <p>
                {profile.name}
              </p>

            </div>

            <div className="profile-item">

              <label>
                Mobile
              </label>

              <p>
                {profile.mobileNumber}
              </p>

            </div>

            <div className="profile-item">

              <label>
                Email
              </label>

              <p>
                {profile.email || "N/A"}
              </p>

            </div>

          </div>

        </div>

        <div className="profile-section">

          <h3>
            Address Information
          </h3>

          <div className="profile-grid">

            <div className="profile-item">

              <label>
                Address
              </label>

              <p>
                {profile.addressLine1}
              </p>

            </div>

            <div className="profile-item">

              <label>
                City
              </label>

              <p>
                {profile.city || "N/A"}
              </p>

            </div>

            <div className="profile-item">

              <label>
                State
              </label>

              <p>
                {profile.state || "N/A"}
              </p>

            </div>

            <div className="profile-item">

              <label>
                Country
              </label>

              <p>
                {profile.country || "India"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* EDIT POPUP */}
      {showEditPopup && (

      <div
        className="edit-popup-overlay"
        onClick={() =>
          setShowEditPopup(false)
        }
      >

        <div
          className="edit-popup"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <h2>
            Edit Profile
          </h2>

          <div className="edit-grid">

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editForm.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile"
              value={editForm.mobileNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="email"
              placeholder="Email"
              value={editForm.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="addressLine1"
              placeholder="Address"
              value={editForm.addressLine1}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={editForm.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={editForm.state}
              onChange={handleChange}
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={editForm.country}
              onChange={handleChange}
            />

            <div className="file-upload-box">

              <label>
                Choose Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

          </div>

          <div className="popup-buttons">

            <button
              className="cancel-btn"
              onClick={() =>
                setShowEditPopup(false)
              }
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save
            </button>

          </div>

        </div>

      </div>
      )}

     
     {/* CHANGE PASSWORD POPUP */}
{showPasswordPopup && (

<div
  className="edit-popup-overlay"
  onClick={() => {

    setShowPasswordPopup(false);

    setIsVerified(false);
  }}
>

  <div
    className="edit-popup"
    onClick={(e) =>
      e.stopPropagation()
    }
  >

    <h2>
      Change Password
    </h2>

    <div className="edit-grid">

      {/* BEFORE VERIFY */}
      {!isVerified && (

      <>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={passwordForm.username}
          onChange={handlePasswordChange}
        />

        {/* OLD PASSWORD */}
        <div className="password-input-box">

          <input
            type={
              showOldPassword
                ? "text"
                : "password"
            }
            name="oldPassword"
            placeholder="Old Password"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
          />

          <span
            className="password-eye"
            onClick={() =>
              setShowOldPassword(
                !showOldPassword
              )
            }
          >

            {showOldPassword
              ? <FaEyeSlash />
              : <FaEye />}

          </span>

        </div>
      </>
      )}

      {/* AFTER VERIFY */}
      {isVerified && (

      <>
        {/* NEW PASSWORD */}
        <div className="password-input-box">

          <input
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            name="newPassword"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />

          <span
            className="password-eye"
            onClick={() =>
              setShowNewPassword(
                !showNewPassword
              )
            }
          >

            {showNewPassword
              ? <FaEyeSlash />
              : <FaEye />}

          </span>

        </div>

        {/* CONFIRM PASSWORD */}
        <div className="password-input-box">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            placeholder="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />

          <span
            className="password-eye"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >

            {showConfirmPassword
              ? <FaEyeSlash />
              : <FaEye />}

          </span>

        </div>
      </>
      )}

    </div>

    <div className="popup-buttons">

      <button
        className="cancel-btn"
        onClick={() => {

          setShowPasswordPopup(false);

          setIsVerified(false);
        }}
      >
        Cancel
      </button>

      {!isVerified ? (

      <button
        className="save-btn"
        onClick={handleVerifyPassword}
      >
        Verify
      </button>

      ) : (

      <button
        className="save-btn"
        onClick={handlePasswordSave}
      >
        Update Password
      </button>

      )}

    </div>

  </div>

</div>
)}
    </div>
  );
}

export default AdminProfile;