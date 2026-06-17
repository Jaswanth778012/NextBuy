// src/pages/WishlistAlerts.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import wishlistAlertService from '../services/wishlistAlertService';
import '../styles/WishlistAlerts.css';
import QuickAlertButton from "../components/wishlist/QuickAlertButton.jsx";

const AlertTypeBadge = ({ type }) => {
    const labels = {
        PRICE_DROP: 'Price Drop',
        BACK_IN_STOCK: 'Back in Stock',
        PRICE_TARGET: 'Target Price'
    };
    const colors = {
        PRICE_DROP: 'type-price',
        BACK_IN_STOCK: 'type-stock',
        PRICE_TARGET: 'type-target'
    };
    return <span className={`alert-type-badge ${colors[type] || 'type-default'}`}>{labels[type] || type}</span>;
};

const AlertStatusBadge = ({ status }) => {
    const colors = {
        ACTIVE: 'status-active',
        TRIGGERED: 'status-triggered',
        PAUSED: 'status-paused',
        EXPIRED: 'status-expired',
        DISABLED: 'status-disabled'
    };
    return <span className={`alert-status-badge ${colors[status] || 'status-default'}`}>{status}</span>;
};

const WishlistAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionLoading, setActionLoading] = useState({}); // Track loading per alert action
    const [submitting, setSubmitting] = useState(false); // Track form submission
    const [error, setError] = useState(null); // Global error state instead of alert()
    const modalRef = useRef(null);
    const firstInputRef = useRef(null);

    const [createForm, setCreateForm] = useState({
        productId: '',
        alertType: 'PRICE_DROP',
        targetPrice: '',
        emailEnabled: true
    });

    // Fetch alerts with cleanup on unmount
    useEffect(() => {
        let mounted = true;
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await wishlistAlertService.getMyAlerts();
                if (mounted) {
                    setAlerts(response.data);
                }
            } catch (err) {
                if (mounted) {
                    console.error('Failed to load alerts', err);
                    setError(err.response?.data?.message || 'Failed to load alerts');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        fetchAlerts();
        return () => { mounted = false; };
    }, []);

    // Focus management when modal opens
    useEffect(() => {
        if (showCreateModal && firstInputRef.current) {
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [showCreateModal]);

    // Reset form when modal closes without submission
    useEffect(() => {
        if (!showCreateModal && !submitting) {
            setCreateForm({
                productId: '',
                alertType: 'PRICE_DROP',
                targetPrice: '',
                emailEnabled: true
            });
            setSelectedProduct(null);
        }
    }, [showCreateModal, submitting]);

    const handleCreateAlert = useCallback(async (e) => {
        e.preventDefault();
        if (submitting) return;
        
        try {
            setSubmitting(true);
            setError(null);
            const payload = {
                ...createForm,
                productId: parseInt(createForm.productId, 10),
                targetPrice: createForm.targetPrice ? parseFloat(createForm.targetPrice) : null
            };
            await wishlistAlertService.createAlert(payload);
            setShowCreateModal(false);
            setCreateForm({
                productId: '',
                alertType: 'PRICE_DROP',
                targetPrice: '',
                emailEnabled: true
            });
            setSelectedProduct(null);
            fetchAlerts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create alert');
        } finally {
            setSubmitting(false);
        }
    }, [createForm, submitting]);

    const handleToggle = useCallback(async (alertId) => {
        if (actionLoading[alertId]) return;
        
        try {
            setActionLoading(prev => ({ ...prev, [alertId]: true }));
            await wishlistAlertService.toggleAlertStatus(alertId);
            fetchAlerts();
        } catch (err) {
            setError('Failed to toggle alert');
            console.error('Failed to toggle alert', err);
        } finally {
            setActionLoading(prev => ({ ...prev, [alertId]: false }));
        }
    }, [actionLoading]);

    const handleDelete = useCallback(async (alertId) => {
        if (actionLoading[alertId]) return;
        if (!window.confirm('Are you sure you want to delete this alert?')) return;
        
        try {
            setActionLoading(prev => ({ ...prev, [alertId]: true }));
            await wishlistAlertService.deleteAlert(alertId);
            fetchAlerts();
        } catch (err) {
            setError('Failed to delete alert');
            console.error('Failed to delete alert', err);
        } finally {
            setActionLoading(prev => ({ ...prev, [alertId]: false }));
        }
    }, [actionLoading]);

    const openCreateModal = useCallback((product = null) => {
        setError(null);
        if (product) {
            setSelectedProduct(product);
            setCreateForm(prev => ({ ...prev, productId: product.id }));
        } else {
            setSelectedProduct(null);
            setCreateForm(prev => ({ ...prev, productId: '' }));
        }
        setShowCreateModal(true);
    }, []);

    const closeModal = useCallback(() => {
        if (submitting) return;
        setShowCreateModal(false);
    }, [submitting]);

    const formatPrice = useCallback((price) => {
        if (price === null || price === undefined || price === '') return '-';
        const num = parseFloat(price);
        if (isNaN(num)) return '-';
        return `$${num.toFixed(2)}`;
    }, []);

    // Memoize sorted/filtered alerts if needed in future
    const sortedAlerts = useMemo(() => {
        return [...alerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [alerts]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showCreateModal && !submitting) {
                setShowCreateModal(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showCreateModal, submitting]);

    if (loading) return <div className="alerts-loading">Loading your alerts...</div>;

    return (
        <div className="wishlist-alerts-page">
            <div className="alerts-header">
                <h2>My Price Alerts</h2>
                <button type="button" className="btn-add-alert" onClick={() => openCreateModal()}>
                    + Set Up Alert
                </button>
            </div>

            {error && (
                <div className="error-banner" role="alert">
                    {error}
                    <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">×</button>
                </div>
            )}

            {alerts.length === 0 ? (
                <div className="alerts-empty">
                    <div className="empty-icon" aria-hidden="true">🔔</div>
                    <h3>No alerts set up yet</h3>
                    <p>Get notified when prices drop or items come back in stock.</p>
                    <button type="button" className="btn-add-alert" onClick={() => openCreateModal()}>
                        Create Your First Alert
                    </button>
                </div>
            ) : (
                <div className="alerts-list">
                    {sortedAlerts.map(alert => (
                        <div 
                            key={alert.id} 
                            className={`alert-card ${alert.status?.toLowerCase() || ''}`}
                        >
                            <div className="alert-product">
                                <img 
                                    src={alert.productImageUrl || '/placeholder-product.png'} 
                                    alt={alert.productName}
                                    className="alert-product-image"
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = '/placeholder-product.png'; 
                                    }}
                                    loading="lazy"
                                />
                                <div className="alert-product-info">
                                    <h4>{alert.productName}</h4>
                                    <div className="alert-meta">
                                        <AlertTypeBadge type={alert.alertType} />
                                        <AlertStatusBadge status={alert.status} />
                                    </div>
                                </div>
                            </div>

                            <div className="alert-details">
                                <div className="detail-row">
                                    <span className="label">Current Price</span>
                                    <span className="value price">{formatPrice(alert.currentPrice)}</span>
                                </div>
                                {alert.targetPrice !== null && alert.targetPrice !== undefined && (
                                    <div className="detail-row">
                                        <span className="label">Target Price</span>
                                        <span className="value target">{formatPrice(alert.targetPrice)}</span>
                                    </div>
                                )}
                                {alert.lastNotifiedPrice !== null && alert.lastNotifiedPrice !== undefined && (
                                    <div className="detail-row">
                                        <span className="label">Last Notified</span>
                                        <span className="value">{formatPrice(alert.lastNotifiedPrice)}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="label">Notifications</span>
                                    <span className="value">{alert.notificationCount || 0}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Created</span>
                                    <span className="value">{new Date(alert.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="alert-actions">
                                <button 
                                    type="button"
                                    className={`btn-toggle ${alert.status === 'ACTIVE' ? 'btn-pause' : 'btn-activate'}`}
                                    onClick={() => handleToggle(alert.id)}
                                    disabled={actionLoading[alert.id]}
                                    aria-label={alert.status === 'ACTIVE' ? 'Pause alert' : 'Activate alert'}
                                >
                                    {actionLoading[alert.id] ? 'Processing...' : (alert.status === 'ACTIVE' ? 'Pause' : 'Activate')}
                                </button>
                                <button 
                                    type="button"
                                    className="btn-delete" 
                                    onClick={() => handleDelete(alert.id)}
                                    disabled={actionLoading[alert.id]}
                                    aria-label="Delete alert"
                                >
                                    {actionLoading[alert.id] ? 'Processing...' : 'Delete'}
                                </button>
                            </div>

                            {alert.status === 'TRIGGERED' && (
                                <div className="alert-triggered-banner" role="status">
                                    🎉 Alert triggered! Check your email for details.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div 
                    className="modal-overlay" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    ref={modalRef}
                >
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 id="modal-title">Set Up Price Alert</h3>
                        <form onSubmit={handleCreateAlert}>
                            {!selectedProduct && (
                                <div className="form-group">
                                    <label htmlFor="productId">Product ID *</label>
                                    <input 
                                        id="productId"
                                        ref={firstInputRef}
                                        type="number" 
                                        value={createForm.productId} 
                                        onChange={(e) => setCreateForm({...createForm, productId: e.target.value})}
                                        required
                                        placeholder="Enter product ID from your wishlist"
                                        disabled={submitting}
                                    />
                                </div>
                            )}
                            {selectedProduct && (
                                <div className="selected-product">
                                    <img src={selectedProduct.imageUrl} alt="" className="selected-thumb" loading="lazy" />
                                    <div>
                                        <span>{selectedProduct.name}</span>
                                        <strong>${selectedProduct.finalPrice}</strong>
                                    </div>
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="alertType">Alert Type *</label>
                                <select 
                                    id="alertType"
                                    value={createForm.alertType} 
                                    onChange={(e) => setCreateForm({...createForm, alertType: e.target.value})}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="PRICE_DROP">Any Price Drop</option>
                                    <option value="PRICE_TARGET">Target Price</option>
                                    <option value="BACK_IN_STOCK">Back in Stock</option>
                                </select>
                            </div>
                            {createForm.alertType === 'PRICE_TARGET' && (
                                <div className="form-group">
                                    <label htmlFor="targetPrice">Target Price *</label>
                                    <input 
                                        id="targetPrice"
                                        type="number" 
                                        step="0.01" 
                                        value={createForm.targetPrice} 
                                        onChange={(e) => setCreateForm({...createForm, targetPrice: e.target.value})}
                                        required
                                        placeholder="Enter your target price"
                                        disabled={submitting}
                                    />
                                </div>
                            )}
                            <div className="form-row checkbox-row">
                                <label htmlFor="emailEnabled">
                                    <input 
                                        id="emailEnabled"
                                        type="checkbox" 
                                        checked={createForm.emailEnabled} 
                                        onChange={(e) => setCreateForm({...createForm, emailEnabled: e.target.checked})}
                                        disabled={submitting}
                                    />
                                    Email notifications
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel" 
                                    onClick={closeModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-save"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating...' : 'Create Alert'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistAlerts;