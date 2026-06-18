import React from "react";

function ChangePasswordForm({
  passwordData,
  handlePasswordChange,
  handleChangePassword,
  saving,
  setShowPasswordForm,
}) {
  return (
    <div className="content-section">
      <h3 className="section-title">
        Change Password
      </h3>

      <form
        onSubmit={handleChangePassword}
        className="profile-form"
      >
        {/* CURRENT PASSWORD */}
        <div className="form-group">
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
            placeholder="Enter current password"
          />
        </div>

        {/* NEW PASSWORD + CONFIRM PASSWORD */}
        <div className="form-row">

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Re-enter new password"
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="form-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setShowPasswordForm(false)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Password"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default ChangePasswordForm;