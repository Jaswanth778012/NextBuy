import React, {
  useEffect,
  useState,
} from "react";

import {
  getAlerts,
  toggleAlert,
  deleteAlert,
} from "../services/wishlistAlertService";

import WishlistAlertCard from "../components/wishlist/WishlistAlertCard";
import WishlistAlertEditModal from "../components/wishlist/WishlistAlertEditModal";

import "../styles/WishlistAlerts.css";

function WishlistAlertsPage() {
  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedAlert,
    setSelectedAlert,
  ] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();

      setAlerts(data);
    } catch (error) {
      console.error(
        "Failed to load alerts",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAlert(id);

      fetchAlerts();
    } catch (error) {
      console.error(
        "Failed to toggle alert",
        error
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);

      fetchAlerts();
    } catch (error) {
      console.error(
        "Failed to delete alert",
        error
      );
    }
  };

  const handleUpdateSuccess = () => {
    setSelectedAlert(null);

    fetchAlerts();
  };

  if (loading) {
    return (
      <div className="alerts-loading">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="wishlist-alerts-page">

      <div className="alerts-header">
        <h2>
          🔔 Wishlist Alerts
        </h2>
      </div>

      {alerts.length === 0 ? (
        <div className="alerts-empty">

          <div className="empty-icon">
            🔕
          </div>

          <h3>
            No Alerts Found
          </h3>

          <p>
            Create alerts from your
            wishlist products and
            get notified about price
            drops and stock updates.
          </p>

        </div>
      ) : (
        <div className="alerts-list">

          {alerts.map((alert) => (
            <WishlistAlertCard
              key={alert.id}
              alert={alert}
              onToggle={
                handleToggle
              }
              onDelete={
                handleDelete
              }
              onEdit={
                setSelectedAlert
              }
            />
          ))}

        </div>
      )}

      {/* UPDATE ALERT MODAL */}

      {selectedAlert && (
        <WishlistAlertEditModal
          alert={selectedAlert}
          onClose={() =>
            setSelectedAlert(
              null
            )
          }
          onUpdated={
            handleUpdateSuccess
          }
        />
      )}

    </div>
  );
}

export default WishlistAlertsPage;