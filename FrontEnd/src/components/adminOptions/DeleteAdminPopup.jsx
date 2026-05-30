import React, {
  useState
} from "react";

import {
  deleteAdmin
} from "../../services/adminService";

import {
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle
} from "react-icons/fa";

import { toast }
from "react-toastify";

function DeleteAdminPopup({
  closePopup
}) {

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [showConfirmPopup,
    setShowConfirmPopup] =
    useState(false);

  /* =========================
     OPEN CONFIRM POPUP
  ========================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    setShowConfirmPopup(true);
  };

  /* =========================
     FINAL DELETE API
  ========================= */

  const handleConfirmDelete =
    async () => {

      try {

        setLoading(true);

        const response =
          await deleteAdmin(

            encodeURIComponent(username),

            encodeURIComponent(password)

          );

       if (
  response.data
    .toLowerCase()
    .includes("success")
) {

  toast.success(response.data);

  setShowConfirmPopup(false);

  closePopup();

} else {

  toast.error(response.data);
}

        setShowConfirmPopup(false);

        closePopup();

      } catch (error) {

        toast.error(

          error.response?.data ||

          error.message ||

          "Failed To Delete Admin"
        );

      } finally {

        setLoading(false);
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
            Delete Admin
          </h2>

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}

            <div className="popup-input-wrapper">

              <FaUserShield
                className="popup-field-icon"
              />

              <input
                type="text"
                placeholder="Enter Admin Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="popup-password-wrapper">

              <FaLock
                className="popup-field-icon"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter Password"

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

            {/* BUTTONS */}

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
                Delete Admin
              </button>

            </div>

          </form>

        </div>

      </div>

      {/* CONFIRM POPUP */}

      {
        showConfirmPopup && (

          <div className="popup-overlay">

            <div
              className="confirm-popup-box"
            >

              <FaExclamationTriangle
                className="confirm-popup-icon"
              />

              <h3>
                Confirm Delete
              </h3>

              <p>
                Are you sure you want
                to delete this admin?
              </p>

              <div
                className="confirm-popup-actions"
              >

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
                  onClick={
                    handleConfirmDelete
                  }
                >

                  {
                    loading
                      ? "Deleting..."
                      : "Yes, Delete"
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
DeleteAdminPopup;