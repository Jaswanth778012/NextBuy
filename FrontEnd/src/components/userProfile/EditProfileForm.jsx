import React from "react";

function EditProfileForm({
  formData,
  handleInputChange,
  handleUpdateProfile,
  saving,
  setEditMode,
}) {
  return (
    <div className="content-section">
      <h3 className="section-title">
        Edit Profile
      </h3>

      <p className="section-hint">
        Click on your avatar to change profile picture
      </p>

      <form
        onSubmit={handleUpdateProfile}
        className="profile-form"
      >
        {/* NAME + EMAIL */}
        <div className="form-row">

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
          />
        </div>

        {/* ADDRESS */}
        <div className="form-group">
          <label>Address</label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            placeholder="Enter your full address"
          />
        </div>

        {/* CITY / STATE / PINCODE */}
        <div className="form-row three-col">

          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
            />
          </div>

        </div>

        {/* COUNTRY */}
        <div className="form-group">
          <label>Country</label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="form-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;