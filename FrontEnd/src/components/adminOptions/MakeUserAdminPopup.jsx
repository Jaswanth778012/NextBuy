import React, {
  useState
} from "react";

import {
  makeUserToAdmin
} from "../../services/adminService";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield
} from "react-icons/fa";

import { toast }
from "react-toastify";

function MakeUserAdminPopup({
  closePopup
}) {

  const [email, setEmail] =
    useState("");

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
     FINAL API CALL
  ========================= */

  const handleConfirmMakeAdmin =
    async () => {

      try {

        setLoading(true);

        const response =
          await makeUserToAdmin(

            encodeURIComponent(email),

            encodeURIComponent(username),

            encodeURIComponent(password)
          );

        toast.success(
          response.data
        );

        setShowConfirmPopup(false);

        closePopup();

      } catch (error) {

        console.log(error);

        console.log(error.response);

        toast.error(

          error.response?.data ||

          error.message ||

          "Failed To Make Admin"
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
            Make User To Admin
          </h2>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="popup-input-wrapper">

              <FaEnvelope
                className="popup-field-icon"
              />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            {/* USERNAME */}

            <div className="popup-input-wrapper">

              <FaUser
                className="popup-field-icon"
              />

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
                Make Admin
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

              <FaUserShield
                className="confirm-popup-icon"
              />

              <h3>
                Confirm Admin Access
              </h3>

              <p>
                Are you sure you want
                to make this user an admin?
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
                    handleConfirmMakeAdmin
                  }
                >

                  {
                    loading
                      ? "Processing..."
                      : "Yes, Make Admin"
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
MakeUserAdminPopup;