import React from "react";

function ProfileInfo({
  profile,
}) {

  return (

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
  );
}

export default ProfileInfo;