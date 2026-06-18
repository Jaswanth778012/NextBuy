import React from "react";

function DeleteAccountForm({
  deletePassword,
  setDeletePassword,
  handleDeleteProfile,
  saving,
  setShowDeleteConfirm,
}) {
  return (
    <div className="content-section danger-zone">

      <h3 className="section-title">
        Delete Account
      </h3>

      <p className="danger-text">
        This action cannot be undone.
        All your account data will be
        permanently removed.
      </p>

      <div className="form-group">
        <label>
          Enter your password to confirm
        </label>

        <input
          type="password"
          value={deletePassword}
          onChange={(e) =>
            setDeletePassword(
              e.target.value
            )
          }
          placeholder="Enter current password"
        />
      </div>

      <div className="form-actions">

        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn-danger"
          onClick={handleDeleteProfile}
          disabled={saving}
        >
          {saving
            ? "Deleting..."
            : "Permanently Delete Account"}
        </button>

      </div>

    </div>
  );
}

export default DeleteAccountForm;