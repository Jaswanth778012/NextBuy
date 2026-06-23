import React from "react";

function DeleteAccountForm({
  deleteUsername,
  setDeleteUsername,
  deletePassword,
  setDeletePassword,
  handleDeleteProfile,
  saving,
  setShowDeleteConfirm,
}) {
  return (
    <div
      className="delete-overlay"
      onClick={() => setShowDeleteConfirm(false)}
    >
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="delete-account-title">
          Delete Account
        </h3>

        <p className="delete-account-warning">
          This action cannot be undone.
          All your account data will be permanently removed.
        </p>

        
        <div className="delete-account-input-group">
          <label className="delete-account-label">
            Enter your password to confirm
          </label>

          <input
            type="password"
            className="delete-account-input"
            value={deletePassword}
            onChange={(e) =>
              setDeletePassword(e.target.value)
            }
            placeholder="Enter current password"
          />
        </div>

        <div className="delete-account-actions">
          <button
            type="button"
            className="delete-account-cancel-btn"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-account-danger-btn"
            onClick={handleDeleteProfile}
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountForm;