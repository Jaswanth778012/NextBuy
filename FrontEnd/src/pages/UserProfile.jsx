import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getWishlists } from "../services/wishlistService";
import userService from "../services/userService";
import { notifyAuthChange } from "../hooks/useAuth";
import { getAlerts } from "../services/wishlistAlertService";
import ProfileSidebar from "../components/userProfile/ProfileSidebar";
import EditProfileForm from "../components/userProfile/EditProfileForm";
import ChangePasswordForm from "../components/userProfile/ChangePasswordForm";
import DeleteAccountForm from "../components/userProfile/DeleteAccountForm";
import ProfileInfo from "../components/userProfile/ProfileInfo";

import "../styles/UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
const [showImagePopup, setShowImagePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
const [wishlistCount, setWishlistCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [user, setUser] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));

  console.log("Selected Image:", file);
};
  const [deletePassword, setDeletePassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });



  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

 useEffect(() => {
  fetchProfile();
  fetchWishlistCount();
   fetchAlertCount();
}, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await userService.getMyProfile();
      const userData = response.data;

      setUser(userData);

      setFormData({
  name: userData.name || "",
  email: userData.email || "",
  phone: userData.mobileNumber || "",
  address: userData.addressLine1 || "",
  city: userData.city || "",
  state: userData.state || "",
  pincode:userData.pincode||"",
  country: userData.country || "",
});
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAlertCount = async () => {
  try {
    const data = await getAlerts();

    console.log("Alerts:", data);

    setAlertCount(data.length);
  } catch (error) {
    console.log(error);
  }
};
 const fetchWishlistCount = async () => {
  try {
    const data = await getWishlists();

    setWishlistCount(data.length);
  } catch (error) {
    console.log(error);
  }
};
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  

const handleUpdateProfile = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!formData.email.trim()) {
    toast.error("Email is required");
    return;
  }

  try {
    setSaving(true);

    const profilePayload = {
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.phone
        ? Number(formData.phone)
        : null,
      addressLine1: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
       pincode: formData.pincode
    ? Number(formData.pincode)
    : null,
    };

    const response = await userService.updateProfile(
      profilePayload,
      selectedImage
    );

    toast.success(
      response?.data || "Profile updated successfully"
    );

    await fetchProfile();

    setEditMode(false);
    setSelectedImage(null);
    setImagePreview(null);
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      err?.response?.data ||
      "Failed to update profile"
    );
  } finally {
    setSaving(false);
  }
};

  const handleChangePassword = async (e) => {
    console.log("Function called");
  if (e) e.preventDefault();

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  try {
    setSaving(true);

    const response = await userService.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    toast.success(response.data);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);

  } catch (err) {
     console.log("Full Error:", err);
  console.log("Response:", err?.response);
  console.log("Data:", err?.response?.data);

  toast.error(
    err?.response?.data ||
    "Failed to change password"
  );
    toast.error(
      err?.response?.data ||
      "Failed to change password"
    );
  } finally {
    setSaving(false);
  }
};
 
const handleDeleteProfile = async () => {
  try {
    console.log("Username:", user?.username);
    console.log("Password:", deletePassword);

    const response = await userService.deleteProfile(
      user?.username,
      deletePassword
    );

    console.log("SUCCESS:", response);
  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("RESPONSE:", err.response);
    console.log("DATA:", err.response?.data);

    toast.error(err?.response?.data || "Failed to delete account");
  }
};

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const displayImage = imagePreview || user?.dpUrl;

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    
    <div className="user-profile-container">

      {/* LEFT SIDEBAR */}
      <ProfileSidebar
        user={user}
          wishlistCount={wishlistCount}
        editMode={editMode}
         alertCount={alertCount}
        setEditMode={setEditMode}
        showPasswordForm={showPasswordForm}
        setShowPasswordForm={setShowPasswordForm}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        displayImage={displayImage}
        getInitials={getInitials}
        fileInputRef={fileInputRef}
      
        setSelectedImage={setSelectedImage}
        setImagePreview={setImagePreview}
          setShowImagePopup={setShowImagePopup}
      />

      {/* RIGHT CONTENT */}
      <div className="user-profile-content-area">

        {editMode && (
            <EditProfileForm
  formData={formData}
  handleInputChange={handleInputChange}
  handleUpdateProfile={handleUpdateProfile}
  saving={saving}
  setEditMode={setEditMode}
  handleImageChange={handleImageChange}
/>
        )}

        {showPasswordForm && (
          <ChangePasswordForm
  passwordData={passwordData}
  handlePasswordChange={handlePasswordChange}
  handleChangePassword={handleChangePassword}
  saving={saving}
  setShowPasswordForm={setShowPasswordForm}
/>
        )}

        {showDeleteConfirm && (
          <DeleteAccountForm
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            handleDeleteProfile={handleDeleteProfile}
            saving={saving}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        )}

        {!editMode && !showPasswordForm && !showDeleteConfirm && (
          <ProfileInfo
            user={user}
            setShowPasswordForm={setShowPasswordForm}
          />
        )}

      </div>
      {showImagePopup && displayImage && (
  <div
    className="image-preview-overlay"
    onClick={() => setShowImagePopup(false)}
  >
    <div
      className="image-preview-popup"
      onClick={(e) => e.stopPropagation()}
    >
     

      <img
        src={displayImage}
        alt="Profile"
        className="image-preview-large"
      />
    </div>
  </div>
)}
    </div>
  );
}

export default UserProfile;