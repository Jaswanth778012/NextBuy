import React from "react";

function EditProfilePopup({

  editForm,

  handleChange,

  handleImageChange,

  handleSave,

  setShowEditPopup,

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
  );
}

export default EditProfilePopup;