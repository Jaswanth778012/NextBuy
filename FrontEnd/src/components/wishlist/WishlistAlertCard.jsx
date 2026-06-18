import React from "react";

function WishlistAlertCard({
  alert,
  onToggle,
  onDelete,
}) {
  return (
    <div className="wishlist-alert-card">

      <h4>
        {alert.productName}
      </h4>

      <p>
        Target Price:
        ₹{alert.targetPrice}
      </p>

      <p>
        Status:
        {alert.active
          ? " Active"
          : " Disabled"}
      </p>

      <button
        onClick={() =>
          onToggle(alert.id)
        }
      >
        Toggle
      </button>

      <button
        onClick={() =>
          onDelete(alert.id)
        }
      >
        Delete
      </button>

    </div>
  );
}

export default WishlistAlertCard;