import React,
{
  useState,
} from "react";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function ChangePasswordPopup({

  passwordForm,

  handlePasswordChange,

  handlePasswordSave,

  handleVerifyPassword,

  setShowPasswordPopup,

}) {

  const [isVerified,
  setIsVerified] =
  useState(false);

  const [showOldPassword,
  setShowOldPassword] =
  useState(false);

  const [showNewPassword,
  setShowNewPassword] =
  useState(false);

  const [showConfirmPassword,
  setShowConfirmPassword] =
  useState(false);

  const verifyPassword =
    async () => {

      await handleVerifyPassword();

      setIsVerified(true);
  };

  return (

    <div
      className="edit-popup-overlay1"
      onClick={() => {

        setShowPasswordPopup(false);

        setIsVerified(false);
      }}
    >

      <div
        className="edit-popup1"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <h2>
          Change Password
        </h2>

        <div className="edit-grid1">

          {!isVerified && (

          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={passwordForm.username}
              onChange={
                handlePasswordChange
              }
            />

            <div className="password-input-box">

              <input
                type={
                  showOldPassword
                    ? "text"
                    : "password"
                }
                name="oldPassword"
                placeholder="Old Password"
                value={
                  passwordForm.oldPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              <span
                className="password-eye"
                onClick={() =>
                  setShowOldPassword(
                    !showOldPassword
                  )
                }
              >

                {showOldPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </span>

            </div>
          </>
          )}

          {isVerified && (

          <>
            <div className="password-input-box">

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                placeholder="New Password"
                value={
                  passwordForm.newPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              <span
                className="password-eye"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
              >

                {showNewPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </span>

            </div>

            <div className="password-input-box">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  passwordForm.confirmPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              <span
                className="password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >

                {showConfirmPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </span>

            </div>
          </>
          )}

        </div>

        <div className="popup-buttons">

          <button
            className="cancel-btn"
            onClick={() => {

              setShowPasswordPopup(false);

              setIsVerified(false);
            }}
          >
            Cancel
          </button>

          {!isVerified ? (

          <button
            className="save-btn"
            onClick={verifyPassword}
          >
            Verify
          </button>

          ) : (

          <button
            className="save-btn"
            onClick={handlePasswordSave}
          >
            Update Password
          </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default ChangePasswordPopup;