import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import userService from "../services/userService";
import { notifyAuthChange } from "../hooks/useAuth";

import ProfileSidebar from "../components/userProfile/ProfileSidebar";
import EditProfileForm from "../components/userProfile/EditProfileForm";
import ChangePasswordForm from "../components/userProfile/ChangePasswordForm";
import DeleteAccountForm from "../components/userProfile/DeleteAccountForm";
import ProfileInfo from "../components/userProfile/ProfileInfo";

import "../styles/UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [user, setUser] = useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [deletePassword, setDeletePassword] =
    useState("");

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

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response =
        await userService.getMyProfile();

      const userData = response.data;

      setUser(userData);

      setFormData({
        name:
          userData.name ||
          userData.username ||
          "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        pincode: userData.pincode || "",
        country: userData.country || "",
      });
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );
      return;
    }

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleUpdateProfile = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const profilePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      };

      const response =
        await userService.updateProfile(
          profilePayload,
          selectedImage
        );

      toast.success(
        response.data ||
          "Profile updated successfully"
      );

      await fetchProfile();

      const storedUser = JSON.parse(
        localStorage.getItem("user") ||
          "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: formData.name,
          email: formData.email,
        })
      );

      notifyAuthChange();

      setEditMode(false);

      setSelectedImage(null);

      setImagePreview(null);
    } catch (err) {
      toast.error(
        err?.response?.data ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword =
    async (e) => {
      e.preventDefault();

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        toast.error(
          "New passwords do not match"
        );
        return;
      }

      if (
        passwordData.newPassword.length <
        6
      ) {
        toast.error(
          "Password must be at least 6 characters"
        );
        return;
      }

      try {
        setSaving(true);

        const response =
          await userService.changePassword(
            passwordData.currentPassword,
            passwordData.newPassword,
            passwordData.confirmPassword
          );

        toast.success(
          response.data ||
            "Password changed successfully"
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowPasswordForm(false);
      } catch (err) {
        toast.error(
          err?.response?.data ||
            "Failed to change password"
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteProfile =
    async () => {
      if (!deletePassword.trim()) {
        toast.error(
          "Please enter your password"
        );
        return;
      }

      try {
        setSaving(true);

        const response =
          await userService.deleteProfile(
            user?.username,
            deletePassword
          );

        toast.success(
          response.data ||
            "Account deleted"
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "role"
        );

        notifyAuthChange();

        navigate("/login");
      } catch (err) {
        toast.error(
          err?.response?.data ||
            "Failed to delete account"
        );
      } finally {
        setSaving(false);
      }
    };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayImage =
    imagePreview ||
    user?.profileImageUrl;

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

        <ProfileSidebar
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
          showPasswordForm={
            showPasswordForm
          }
          setShowPasswordForm={
            setShowPasswordForm
          }
          showDeleteConfirm={
            showDeleteConfirm
          }
          setShowDeleteConfirm={
            setShowDeleteConfirm
          }
          displayImage={displayImage}
          getInitials={getInitials}
          fileInputRef={fileInputRef}
          handleImageSelect={
            handleImageSelect
          }
          setSelectedImage={
            setSelectedImage
          }
          setImagePreview={
            setImagePreview
          }
        />

        <div className="profile-content">

          {editMode && (
            <EditProfileForm
              formData={formData}
              handleInputChange={
                handleInputChange
              }
              handleUpdateProfile={
                handleUpdateProfile
              }
              saving={saving}
              setEditMode={
                setEditMode
              }
            />
          )}

          {showPasswordForm && (
            <ChangePasswordForm
              passwordData={
                passwordData
              }
              handlePasswordChange={
                handlePasswordChange
              }
              handleChangePassword={
                handleChangePassword
              }
              saving={saving}
              setShowPasswordForm={
                setShowPasswordForm
              }
            />
          )}

          {showDeleteConfirm && (
            <DeleteAccountForm
              deletePassword={
                deletePassword
              }
              setDeletePassword={
                setDeletePassword
              }
              handleDeleteProfile={
                handleDeleteProfile
              }
              saving={saving}
              setShowDeleteConfirm={
                setShowDeleteConfirm
              }
            />
          )}

          {!editMode &&
            !showPasswordForm &&
            !showDeleteConfirm && (
              <ProfileInfo
                user={user}
                setShowPasswordForm={
                  setShowPasswordForm
                }
              />
            )}

        </div>
      </div>
    </div>
  );
}

export default UserProfile;