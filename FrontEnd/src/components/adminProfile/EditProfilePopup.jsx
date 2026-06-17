import React from "react";

import {

  FaUser,

  FaPhone,

  FaEnvelope,

  FaMapMarkerAlt,

  FaCity,

  FaGlobeAsia,

  FaFlag,

  FaImage

} from "react-icons/fa";

function EditProfilePopup({

  editForm,

  handleChange,

  handleImageChange,

  handleSave,

  setShowEditPopup,
  
  isSaving,

}) {

  return (

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

          {/* NAME */}

          <div className="edit-input-wrapper">

            <FaUser className="edit-field-icon" />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editForm.name}
              onChange={handleChange}
            />

          </div>

          {/* MOBILE */}

          <div className="edit-input-wrapper">

            <FaPhone className="edit-field-icon" />

            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile"
              value={editForm.mobileNumber}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}

          <div className="edit-input-wrapper">

            <FaEnvelope className="edit-field-icon" />

            <input
              type="text"
              name="email"
              placeholder="Email"
              value={editForm.email}
              onChange={handleChange}
            />

          </div>

          {/* ADDRESS */}

          <div className="edit-input-wrapper">

            <FaMapMarkerAlt className="edit-field-icon" />

            <input
              type="text"
              name="addressLine1"
              placeholder="Address"
              value={editForm.addressLine1}
              onChange={handleChange}
            />

          </div>

          {/* CITY */}

          <div className="edit-input-wrapper">

            <FaCity className="edit-field-icon" />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={editForm.city}
              onChange={handleChange}
            />

          </div>

          {/* STATE */}

          <div className="edit-input-wrapper">

            <FaGlobeAsia className="edit-field-icon" />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={editForm.state}
              onChange={handleChange}
            />

          </div>

          {/* COUNTRY */}

          <div className="edit-input-wrapper">

            <FaFlag className="edit-field-icon" />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={editForm.country}
              onChange={handleChange}
            />

          </div>

          {/* IMAGE */}

          <div className="edit-file-upload-box">

            <label>

              <FaImage className="edit-upload-icon" />

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
  disabled={isSaving}
>
  {isSaving ? "Saving..." : "Save"}
</button>

        </div>

      </div>

    </div>
  );
}

export default EditProfilePopup;