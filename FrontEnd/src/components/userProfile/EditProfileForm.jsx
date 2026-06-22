import React from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaGlobeAsia,
  FaFlag,
  FaImage,
} from "react-icons/fa";

function EditProfilePopup({
  formData,
  handleInputChange,
  handleUpdateProfile,
  saving,
  setEditMode,
  handleImageChange,
}) {
  return (
    <div
      className="profile-edit-overlay"
      onClick={() => setEditMode(false)}
    >
      <div
        className="profile-edit-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="profile-edit-title">Edit Profile</h2>

        <form onSubmit={handleUpdateProfile}>
          <div className="profile-edit-grid">

            <div className="profile-input-box">
              <FaUser />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </div>

            <div className="profile-input-box">
              <FaPhone />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                required
              />
            </div>

            <div className="profile-input-box">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="profile-input-box">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
            </div>

            <div className="profile-input-box">
              <FaCity />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
            </div>

            <div className="profile-input-box">
              <FaGlobeAsia />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
              />
            </div>

            <div className="profile-input-box">
              <FaFlag />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
              />
            </div>
            <div className="profile-input-box">
  <FaMapMarkerAlt />
  <input
    type="number"
    name="pincode"
    value={formData.pincode}
    onChange={handleInputChange}
    placeholder="Pincode"
  />
</div>

            <div className="profile-file-box">
              <label>
                <FaImage /> Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

          </div>

          <div className="profile-edit-buttons">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePopup;