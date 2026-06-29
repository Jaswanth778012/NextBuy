import React from "react";
import { FaTrash, FaTimes } from "react-icons/fa";

function DeleteAddressModal({
  showModal,
  setShowModal,
  handleDelete,
}) {
  if (!showModal) return null;

  return (
    <div
      className="delete-modal-overlay"
      onClick={() => setShowModal(false)}
    >
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ICON */}
        <div className="delete-icon">
          <FaTrash />
        </div>

        {/* TITLE */}
        <h3>Delete Address?</h3>

        {/* MESSAGE */}
        <p>
          Are you sure you want to delete this address?  
          This action cannot be undone.
        </p>

        {/* ACTIONS */}
        <div className="delete-actions">

          <button
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            <FaTimes style={{ marginRight: "6px" }} />
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            <FaTrash style={{ marginRight: "6px" }} />
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default DeleteAddressModal;