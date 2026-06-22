import React from "react";

function UserProfileSidebar({
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
  setShowImagePopup,
}) {
  return (
    <div className="user-profile-sidebar">

      <div className="user-profile-card">

        <div className="user-avatar-section">

          <div
            className="user-avatar-wrapper"
            onClick={() => {
              if (editMode) {
                fileInputRef.current?.click();
              } else if (displayImage) {
                setShowImagePopup(true);
              }
            }}
            style={{ cursor: "pointer" }}
          >

            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                className="user-avatar-img"
              />
            ) : (
              <div className="user-avatar-fallback">
                {getInitials(
                  user?.name || user?.username
                )}
              </div>
            )}

            {editMode && (
              <div className="user-avatar-overlay">
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
                  <line x1="12" y1="3" x2="12" y2="15" />
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

          <h3 className="user-profile-name">
            {user?.name || user?.username || "User"}
          </h3>

          <span className="user-profile-role">
            {user?.role || "USER"}
          </span>

        </div>

        <div className="user-profile-stats">

          <div className="user-stat-item">
            <span className="user-stat-value">
              {user?.orderCount || 0}
            </span>
            <span className="user-stat-label">
              Orders
            </span>
          </div>

          <div className="user-stat-item">
            <span className="user-stat-value">
              {user?.wishlistCount || 0}
            </span>
            <span className="user-stat-label">
              Wishlist
            </span>
          </div>

          <div className="user-stat-item">
            <span className="user-stat-value">
              {user?.alertCount || 0}
            </span>
            <span className="user-stat-label">
              Alerts
            </span>
          </div>

        </div>

        <div className="user-profile-actions">

          <button
            className={`user-action-btn ${
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
            Edit Profile
          </button>

          <button
            className={`user-action-btn ${
              showPasswordForm ? "active" : ""
            }`}
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setEditMode(false);
              setShowDeleteConfirm(false);
            }}
          >
            Change Password
          </button>

          <button
            className="user-action-btn danger"
            onClick={() => {
              setShowDeleteConfirm(!showDeleteConfirm);
              setEditMode(false);
              setShowPasswordForm(false);
            }}
          >
            Delete Account
          </button>

        </div>

      </div>
    </div>
  );
}

export default UserProfileSidebar;