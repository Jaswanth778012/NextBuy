// src/services/wishlistAlertService.js
import api from './api';

const wishlistAlertService = {
    createAlert: (data) => api.post('/wishlist-alerts', data),
    getMyAlerts: () => api.get('/wishlist-alerts'),
    getMyActiveAlerts: () => api.get('/wishlist-alerts/active'),
    updateAlert: (alertId, data) => api.put(`/wishlist-alerts/${alertId}`, data),
    toggleAlertStatus: (alertId) => api.patch(`/wishlist-alerts/${alertId}/toggle`),
    deleteAlert: (alertId) => api.delete(`/wishlist-alerts/${alertId}`),
};

export default wishlistAlertService;