import React from "react";

function ProfileInfo({
  user,
  setShowPasswordForm,
}) {
  return (
    <>
      {/* PERSONAL INFORMATION */}
      <div className="content-section">

        <h3 className="section-title">
          Personal Information
        </h3>

        <div className="info-grid">

          <div className="info-item">
            <span className="info-label">
              Full Name
            </span>

            <span className="info-value">
              {user?.name ||
                user?.username ||
                "Not set"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Email
            </span>

            <span className="info-value">
              {user?.email || "Not set"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Phone
            </span>

            <span className="info-value">
              {user?.phone || "Not set"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Username
            </span>

            <span className="info-value">
              {user?.username ||
                "Not set"}
            </span>
          </div>

        </div>
      </div>

      {/* ADDRESS */}
      <div className="content-section">

        <h3 className="section-title">
          Address
        </h3>

        <div className="address-card">

          {user?.address ? (
            <>
              <p>{user.address}</p>

              <p>
                {user.city}
                {user.city &&
                user.state
                  ? ", "
                  : ""}
                {user.state}{" "}
                {user.pincode}
              </p>

              <p>{user.country}</p>
            </>
          ) : (
            <p className="empty-text">
              No address saved.
              Click "Edit Profile"
              to add one.
            </p>
          )}

        </div>

      </div>

      {/* ACCOUNT SECURITY */}
      <div className="content-section">

        <h3 className="section-title">
          Account Security
        </h3>

        <div className="security-item">

          <div>
            <span className="security-title">
              Password
            </span>

            <span className="security-desc">
              Change your account
              password
            </span>
          </div>

          <button
            className="btn-outline"
            onClick={() =>
              setShowPasswordForm(true)
            }
          >
            Change
          </button>

        </div>

      </div>
    </>
  );
}

export default ProfileInfo;