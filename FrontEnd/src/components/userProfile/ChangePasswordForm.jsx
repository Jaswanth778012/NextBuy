import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

function ChangePasswordForm({
  passwordData,
  handlePasswordChange,
  handleChangePassword,
  saving,
  setShowPasswordForm,
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div
      className="user-password-overlay"
      onClick={() => setShowPasswordForm(false)}
    >
      <div
        className="user-password-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Change Password</h2>

        <div className="user-password-grid">

          {/* Current Password */}
          <div className="user-input-box">
            <span className="user-icon-box">
              <FaLock className="user-icon" />
            </span>

            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />

            <span
              className="user-eye"
              onClick={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* New Password */}
          <div className="user-input-box">
            <span className="user-icon-box">
              <FaLock className="user-icon" />
            </span>

            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <span
              className="user-eye"
              onClick={() =>
                setShowNewPassword(!showNewPassword)
              }
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="user-input-box">
            <span className="user-icon-box">
              <FaLock className="user-icon" />
            </span>

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />

            <span
              className="user-eye"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

        </div>

        <div className="user-popup-buttons">

          <button
            className="user-cancel-btn"
            onClick={() => setShowPasswordForm(false)}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="user-save-btn"
            onClick={handleChangePassword}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Password"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ChangePasswordForm;