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

import "../styles/Wishlist.css";

function WishlistAlertsPage() {

  const [alerts, setAlerts] =
    useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts =
    async () => {
      const data =
        await getAlerts();

      setAlerts(data);
    };

  const handleToggle =
    async (id) => {
      await toggleAlert(id);
      fetchAlerts();
    };

  const handleDelete =
    async (id) => {
      await deleteAlert(id);
      fetchAlerts();
    };

  return (
    <div>

      <h2>
        Wishlist Alerts
      </h2>

      {alerts.map(
        (alert) => (
          <WishlistAlertCard
            key={alert.id}
            alert={alert}
            onToggle={
              handleToggle
            }
            onDelete={
              handleDelete
            }
          />
        )
      )}

    </div>
  );
}

export default WishlistAlertsPage;