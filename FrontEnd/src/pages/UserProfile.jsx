import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import { notifyAuthChange } from '../hooks/useAuth';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await userService.getMyProfile();
            const userData = response.data;
            setUser(userData);
            setFormData({
                name: userData.name || userData.username || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
                pincode: userData.pincode || '',
                country: userData.country || ''
            });
        } catch (err) {
            toast.error('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            
            // Build profile payload matching your userProfileDTO
            const profilePayload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country
            };

            const response = await userService.updateProfile(profilePayload, selectedImage);
            toast.success(response.data || 'Profile updated successfully');
            
            // Refresh profile data
            await fetchProfile();
            
            // Update localStorage user data for Header
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                name: formData.name,
                email: formData.email,
                profileImageUrl: user?.profileImageUrl // will refresh on fetch
            }));
            notifyAuthChange();
            
            setEditMode(false);
            setSelectedImage(null);
            setImagePreview(null);
        } catch (err) {
            toast.error(err?.response?.data || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setSaving(true);
            const response = await userService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );
            
            toast.success(response.data || 'Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err) {
            toast.error(err?.response?.data || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (!deletePassword.trim()) {
            toast.error('Please enter your password to confirm deletion');
            return;
        }

        try {
            setSaving(true);
            const response = await userService.deleteProfile(user?.username, deletePassword);
            toast.success(response.data || 'Account deleted');
            
            // Clear everything and logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            notifyAuthChange();
            navigate('/login');
        } catch (err) {
            toast.error(err?.response?.data || 'Failed to delete account');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const displayImage = imagePreview || user?.profileImageUrl;

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            <div className="profile-container">
                {/* LEFT: Profile Card */}
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar-wrapper" onClick={() => editMode && fileInputRef.current?.click()}>
                                {displayImage ? (
                                    <img src={displayImage} alt="Profile" className="profile-avatar" />
                                ) : (
                                    <div className="avatar-fallback">{getInitials(user?.name || user?.username)}</div>
                                )}
                                {editMode && (
                                    <div className="avatar-overlay">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageSelect} 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                            />
                            <h3 className="profile-name">{user?.name || user?.username || 'User'}</h3>
                            <p className="profile-email">{user?.email}</p>
                            <span className="profile-role">{user?.role || 'USER'}</span>
                        </div>
                        
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-value">{user?.orderCount || 0}</span>
                                <span className="stat-label">Orders</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{user?.wishlistCount || 0}</span>
                                <span className="stat-label">Wishlist</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{user?.alertCount || 0}</span>
                                <span className="stat-label">Alerts</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button 
                                className={`action-btn ${editMode ? 'active' : ''}`}
                                onClick={() => {
                                    setEditMode(!editMode);
                                    setShowPasswordForm(false);
                                    setShowDeleteConfirm(false);
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                {editMode ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                            <button 
                                className={`action-btn ${showPasswordForm ? 'active' : ''}`}
                                onClick={() => {
                                    setShowPasswordForm(!showPasswordForm);
                                    setEditMode(false);
                                    setShowDeleteConfirm(false);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Change Password
                            </button>
                            <button 
                                className="action-btn danger"
                                onClick={() => {
                                    setShowDeleteConfirm(!showDeleteConfirm);
                                    setEditMode(false);
                                    setShowPasswordForm(false);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Content */}
                <div className="profile-content">
                    {/* Edit Profile Form */}
                    {editMode && (
                        <div className="content-section">
                            <h3 className="section-title">Edit Profile</h3>
                            <p className="section-hint">Click on your avatar to change profile picture</p>
                            <form onSubmit={handleUpdateProfile} className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Enter your full address"
                                    />
                                </div>

                                <div className="form-row three-col">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input 
                                            type="text" 
                                            name="state" 
                                            value={formData.state} 
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input 
                                            type="text" 
                                            name="pincode" 
                                            value={formData.pincode} 
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    <input 
                                        type="text" 
                                        name="country" 
                                        value={formData.country} 
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Change Password Form */}
                    {showPasswordForm && (
                        <div className="content-section">
                            <h3 className="section-title">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="profile-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" 
                                        name="currentPassword" 
                                        value={passwordData.currentPassword} 
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            value={passwordData.newPassword} 
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            value={passwordData.confirmPassword} 
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Re-enter new password"
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowPasswordForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Delete Account Confirmation */}
                    {showDeleteConfirm && (
                        <div className="content-section danger-zone">
                            <h3 className="section-title">Delete Account</h3>
                            <p className="danger-text">This action cannot be undone. All your data will be permanently removed.</p>
                            <div className="form-group">
                                <label>Enter your password to confirm</label>
                                <input 
                                    type="password" 
                                    value={deletePassword} 
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Your current password"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-danger" 
                                    onClick={handleDeleteProfile}
                                    disabled={saving}
                                >
                                    {saving ? 'Deleting...' : 'Permanently Delete Account'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile Info Display */}
                    {!editMode && !showPasswordForm && !showDeleteConfirm && (
                        <>
                            <div className="content-section">
                                <h3 className="section-title">Personal Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">{user?.name || user?.username || 'Not set'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{user?.email || 'Not set'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{user?.phone || 'Not set'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Username</span>
                                        <span className="info-value">{user?.username || 'Not set'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="content-section">
                                <h3 className="section-title">Address</h3>
                                <div className="address-card">
                                    {user?.address ? (
                                        <>
                                            <p>{user.address}</p>
                                            <p>{user.city}{user.city && user.state ? ', ' : ''}{user.state} {user.pincode}</p>
                                            <p>{user.country}</p>
                                        </>
                                    ) : (
                                        <p className="empty-text">No address saved. Click "Edit Profile" to add one.</p>
                                    )}
                                </div>
                            </div>

                            <div className="content-section">
                                <h3 className="section-title">Account Security</h3>
                                <div className="security-item">
                                    <div>
                                        <span className="security-title">Password</span>
                                        <span className="security-desc">Change your account password</span>
                                    </div>
                                    <button className="btn-outline" onClick={() => setShowPasswordForm(true)}>
                                        Change
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;