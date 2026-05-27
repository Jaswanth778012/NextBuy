import React,
{
  useEffect,
  useState,
} from "react";

import {
  FaUserEdit,
} from "react-icons/fa";

import {
  getAdminProfile,
  editAdminProfile,
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

        // CLEAR FORM
setEditForm({

  name: "",

  mobileNumber: "",

  addressLine1: "",

  city: "",

  state: "",

  country: "",

  email: "",
});

// CLEAR IMAGE
setSelectedImage(null);

// CLOSE POPUP
setShowEditPopup(false);

alert(
  "Profile Updated"
);

      } catch (error) {

        console.log(error);
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
          >

            Change Password

          </button>

        </div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-content-area">

        {/* PERSONAL */}
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

        {/* ADDRESS */}
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

      <div className="edit-popup-overlay">

        <div className="edit-popup">

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

            {/* FILE INPUT */}
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

          {/* BUTTONS */}
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

    </div>
  );
}

export default AdminProfile;