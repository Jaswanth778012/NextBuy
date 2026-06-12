import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function FestivalBannerActionButtons({
  banner,
  openEditModal,
  handleDelete,
}) {
  return (
    <div className="festival-action-group">

      <button
        className="festival-action-btn edit"
        onClick={() => openEditModal(banner)}
      >
        <FaEdit />
      </button>

      <button
        className="festival-action-btn delete"
        onClick={() => handleDelete(banner.id)}
      >
        <FaTrash />
      </button>

    </div>
  );
}

export default FestivalBannerActionButtons;