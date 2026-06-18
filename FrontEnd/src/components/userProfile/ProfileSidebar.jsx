import React from "react";

function ProfileSidebar({
  user,
  editMode,
  setEditMode,
  showPasswordForm,
  setShowPasswordForm,
  showDeleteConfirm,
  setShowDeleteConfirm,
  displayImage,
  getInitials,
  fileInputRef,
  handleImageSelect,
  setSelectedImage,
  setImagePreview,
}) {
  return (
    <div className="profile-sidebar">
      <div className="profile-card">

        {/* AVATAR */}
        <div className="avatar-section">
          <div
            className="avatar-wrapper"
            onClick={() =>
              editMode && fileInputRef.current?.click()
            }
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="avatar-fallback">
                {getInitials(
                  user?.name || user?.username
                )}
              </div>
            )}

            {editMode && (
              <div className="avatar-overlay">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="15"
                  />
                </svg>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: "none" }}
          />

          <h3 className="profile-name">
            {user?.name ||
              user?.username ||
              "User"}
          </h3>

          <p className="profile-email">
            {user?.email}
          </p>

          <span className="profile-role">
            {user?.role || "USER"}
          </span>
        </div>

        {/* STATS */}
        <div className="profile-stats">

          <div className="stat-item">
            <span className="stat-value">
              {user?.orderCount || 0}
            </span>
            <span className="stat-label">
              Orders
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-value">
              {user?.wishlistCount || 0}
            </span>
            <span className="stat-label">
              Wishlist
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-value">
              {user?.alertCount || 0}
            </span>
            <span className="stat-label">
              Alerts
            </span>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">

          <button
            className={`action-btn ${
              editMode ? "active" : ""
            }`}
            onClick={() => {
              setEditMode(!editMode);

              setShowPasswordForm(false);

              setShowDeleteConfirm(false);

              setSelectedImage(null);

              setImagePreview(null);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>

            {editMode
              ? "Cancel Edit"
              : "Edit Profile"}
          </button>

          <button
            className={`action-btn ${
              showPasswordForm
                ? "active"
                : ""
            }`}
            onClick={() => {
              setShowPasswordForm(
                !showPasswordForm
              );

              setEditMode(false);

              setShowDeleteConfirm(
                false
              );
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
              />

              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            Change Password
          </button>

          <button
            className="action-btn danger"
            onClick={() => {
              setShowDeleteConfirm(
                !showDeleteConfirm
              );

              setEditMode(false);

              setShowPasswordForm(
                false
              );
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />

              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>

            Delete Account
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProfileSidebar;