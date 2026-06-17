// src/components/wishlist/QuickAlertButton.jsx
import React, { useState } from "react";
import wishlistAlertService from "../../services/wishlistAlertService";
import "../../styles/WishlistAlerts.css";

const QuickAlertButton = ({ product, onAlertCreated }) => {
    const [loading, setLoading] = useState(false);

    const handleCreateAlert = async () => {
        if (!product?.id || loading) return;
        try {
            setLoading(true);
            await wishlistAlertService.createAlert({
                productId: product.id,
                alertType: 'PRICE_DROP',
                emailEnabled: true
            });
            onAlertCreated?.();
        } catch (err) {
            console.error('Failed to create quick alert', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className="quick-alert-btn" 
            onClick={handleCreateAlert}
            disabled={loading}
            aria-label="Set price alert"
        >
            {loading ? '...' : '🔔 Alert'}
        </button>
    );
};

export default QuickAlertButton;