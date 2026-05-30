import React, {
  useState
} from "react";

import {
  deleteUser
} from "../../services/adminService";

import {
  FaUser,
  FaTrash,
  FaExclamationTriangle
} from "react-icons/fa";

import { toast }
from "react-toastify";

function DeleteUserPopup({
  closePopup
}) {

  const [username, setUsername] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showConfirmPopup,
    setShowConfirmPopup] =
    useState(false);

  /* OPEN CONFIRM */

  const handleSubmit =
    (e) => {

      e.preventDefault();

      setShowConfirmPopup(true);
    };

  /* DELETE USER */

  const handleDeleteUser =
    async () => {

      try {

        setLoading(true);

        const response =
          await deleteUser(username);

        toast.success(
          response.data
        );

        closePopup();

      } catch (error) {

        toast.error(

          error.response?.data ||

          "Failed To Delete User"
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
            Delete User
          </h2>

          <form onSubmit={handleSubmit}>

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
                className="delete-btn"
              >

                <FaTrash />

                Delete User

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
                Confirm Delete
              </h3>

              <p>
                Are you sure you want
                to delete this user?
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
                  className="confirm-delete-btn"
                  onClick={handleDeleteUser}
                >

                  {
                    loading
                      ? "Deleting..."
                      : "Delete"
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

export default DeleteUserPopup;