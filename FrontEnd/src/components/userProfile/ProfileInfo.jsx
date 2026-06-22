import React from "react";

function ProfileInfo({ user }) {
  return (
    <div className="user-main-content">

      {/* PERSONAL INFORMATION */}
      <div className="user-section-card">

        <h3 className="user-section-title">
          Personal Information
        </h3>

        <div className="user-grid">

          <div className="user-item">
            <label>Full Name</label>
            <p>{user?.name || user?.username || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>Email</label>
            <p>{user?.email || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>Phone</label>
            <p>{user?.mobileNumber || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>Username</label>
            <p>{user?.username || "Not set"}</p>
          </div>

        </div>
      </div>

      {/* ADDRESS */}
      <div className="user-section-card">

        <h3 className="user-section-title">
          Address Information
        </h3>

        <div className="user-grid">

          <div className="user-item full">
            <label>Address</label>
            <p>{user?.addressLine1 || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>City</label>
            <p>{user?.city || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>State</label>
            <p>{user?.state || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>Country</label>
            <p>{user?.country || "Not set"}</p>
          </div>

          <div className="user-item">
            <label>Pincode</label>
            <p>{user?.pincode || "Not set"}</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default ProfileInfo;