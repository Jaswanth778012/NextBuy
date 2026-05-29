import React, {
  useState
} from "react";

import {
  updateUserPassword
} from "../../services/adminService";

import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaExclamationTriangle
} from "react-icons/fa";

import { toast }
from "react-toastify";

function UpdateUserPasswordPopup({
  closePopup
}) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);

  /* CONFIRM POPUP */

  const [showConfirmPopup,
    setShowConfirmPopup] =
    useState(false);

  /* OPEN CONFIRM */

  const handleSubmit =
    (e) => {

      e.preventDefault();

      setShowConfirmPopup(true);
    };

  /* FINAL UPDATE */

  const handleConfirmUpdate =
    async () => {

      try {

        setLoading(true);

        const response =
          await updateUserPassword(
            username,
            password
          );

        toast.success(
          response.data
        );

        closePopup();

      } catch (error) {

        toast.error(

          error.response?.data ||

          "Failed To Update Password"
        );

      } finally {

        setLoading(false);

        setShowConfirmPopup(false);
      }
    };

  return (

    <>

      {/* MAIN POPUP */}

      <div
        className="popup-overlay"
        onClick={closePopup}
      >

        <div
          className="popup-box"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <h2>
            Update User Password
          </h2>

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}

            <div className="popup-input-wrapper">

              <FaUser className="popup-field-icon" />

              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="popup-password-wrapper">

              <FaLock className="popup-field-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter New Password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                required
              />

              <span
                className="password-toggle-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {
                  showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                }

              </span>

            </div>

            <div className="popup-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={closePopup}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                Update Password
              </button>

            </div>

          </form>

        </div>

      </div>

      {/* CONFIRM POPUP */}

      {
        showConfirmPopup && (

          <div
            className="popup-overlay"
            onClick={() =>
              setShowConfirmPopup(false)
            }
          >

            <div
              className="confirm-popup-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <FaExclamationTriangle
                className="confirm-popup-icon"
              />

              <h3>
                Confirm Password Update
              </h3>

              <p>
                Are you sure you want to
                update this user's password?
              </p>

              <div className="confirm-popup-actions">

                <button
                  className="confirm-cancel-btn"
                  onClick={() =>
                    setShowConfirmPopup(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="confirm-ok-btn"
                  onClick={handleConfirmUpdate}
                >
                  {
                    loading
                      ? "Updating..."
                      : "OK"
                  }
                </button>

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}

export default
UpdateUserPasswordPopup;