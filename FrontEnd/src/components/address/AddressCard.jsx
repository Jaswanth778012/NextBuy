import React from "react";
import {
  FaPen,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaTrash,
} from "react-icons/fa";

function AddressCard({
  address,
  selectedAddress,
  setSelectedAddress,
  setEditingAddress,
  setShowEditModal,
  onSelectAddress,
  setAddressToDelete,
  setShowDeleteModal,
}) {
  return (
    <div
      className={`address-card ${
        selectedAddress?.id === address.id ? "selected-address" : ""
      }`}
      onClick={() => {
        setSelectedAddress(address);
        onSelectAddress(address);
      }}
    >
      {/* RADIO */}
      <div className="radio-section">
        <input
          type="radio"
          checked={selectedAddress?.id === address.id}
          readOnly
        />
      </div>

      {/* ADDRESS INFO */}
      <div className="address-info">
        <h4>
          <FaUser className="card-icon" />
          {address.fullName}
        </h4>

        <p>
          <FaHome className="card-icon" />
          {address.houseNo}, {address.area}
        </p>

        <p>
          <FaMapMarkerAlt className="card-icon" />
          {address.city}, {address.state} - {address.pincode}
        </p>

        <p>
          <FaPhone className="card-icon" />
          {address.mobileNumber}
        </p>

        <span className="address-type">{address.addressType}</span>
      </div>

      {/* ACTION BUTTONS (BOTTOM RIGHT FIX) */}
      <div className="address-actions">
        <button
          className="edit-address-btn"
          onClick={(e) => {
            e.stopPropagation();
            setEditingAddress(address);
            setShowEditModal(true);
          }}
        >
          <FaPen />
        </button>

        <button
          className="delete-address-btn"
          onClick={(e) => {
            e.stopPropagation();
            setAddressToDelete(address);
            setShowDeleteModal(true);
          }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default AddressCard;