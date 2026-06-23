import React from "react";

function WishlistAlertCard({
  alert,
  onToggle,
  onDelete,
  onEdit,
}) {
  const getTypeClass = () => {
    switch (alert.alertType) {
      case "PRICE_DROP":
        return "type-price";

      case "BACK_IN_STOCK":
        return "type-stock";

      case "PRICE_TARGET":
        return "type-target";

      default:
        return "";
    }
  };

  const getStatusClass = () => {
    switch (alert.status) {
      case "ACTIVE":
        return "status-active";

      case "TRIGGERED":
        return "status-triggered";

      case "PAUSED":
        return "status-paused";

      case "EXPIRED":
        return "status-expired";

      case "DISABLED":
        return "status-disabled";

      default:
        return "";
    }
  };

  return (
    <div
      className={`alert-card ${alert.status?.toLowerCase()}`}
    >
      <div className="alert-product">
        <img
          className="alert-product-image"
          src={
            alert.productImageUrl?.[0] ||
            "/placeholder-product.png"
          }
          alt={alert.productName}
        />

        <div className="alert-product-info">
          <h4>{alert.productName}</h4>

          <div className="alert-meta">
            <span
              className={`alert-type-badge ${getTypeClass()}`}
            >
              {alert.alertType.replaceAll(
                "_",
                " "
              )}
            </span>

            <span
              className={`alert-status-badge ${getStatusClass()}`}
            >
              {alert.status}
            </span>
          </div>
        </div>
      </div>

      <div className="alert-details">
        <div className="detail-row">
          <span className="label">
            Current Price
          </span>

          <span className="value price">
            ₹
            {Number(
              alert.currentPrice
            ).toLocaleString()}
          </span>
        </div>

        {alert.targetPrice && (
          <div className="detail-row">
            <span className="label">
              Target Price
            </span>

            <span className="value target">
              ₹
              {Number(
                alert.targetPrice
              ).toLocaleString()}
            </span>
          </div>
        )}

        <div className="detail-row">
          <span className="label">
            Email Alerts
          </span>

          <span className="value">
            {alert.emailEnabled
              ? "Enabled"
              : "Disabled"}
          </span>
        </div>

        {alert.lastNotifiedAt && (
          <div className="detail-row">
            <span className="label">
              Last Notified
            </span>

            <span className="value">
              {new Date(
                alert.lastNotifiedAt
              ).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="alert-actions">

        {/* EDIT BUTTON */}

        <button
          className="btn-edit"
          onClick={() =>
            onEdit(alert)
          }
        >
          Edit
        </button>

        {/* TOGGLE BUTTON */}

        {alert.status !==
          "EXPIRED" &&
          alert.status !==
            "DISABLED" && (
            <button
              className={
                alert.status ===
                "ACTIVE"
                  ? "btn-toggle btn-pause"
                  : "btn-toggle btn-activate"
              }
              onClick={() =>
                onToggle(alert.id)
              }
            >
              {alert.status ===
              "ACTIVE"
                ? "Pause"
                : "Activate"}
            </button>
          )}

        {/* DELETE BUTTON */}

        <button
          className="btn-delete"
          onClick={() =>
            onDelete(alert.id)
          }
        >
          Delete
        </button>
      </div>

      {alert.status ===
        "TRIGGERED" && (
        <div className="alert-triggered-banner">
          🎯 Alert Triggered
        </div>
      )}
    </div>
  );
}

export default WishlistAlertCard;