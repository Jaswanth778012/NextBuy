import React, {
  useState
} from "react";

import UpdateUserPasswordPopup
from "./UpdateUserPasswordPopup";

import DeleteUserPopup
from "./DeleteUserPopup";

import MakeUserAdminPopup
from "./MakeUserAdminPopup";

import DeleteAdminPopup
from "./DeleteAdminPopup";

function OptionsButtons() {
  const [showDeleteAdminPopup,
setShowDeleteAdminPopup] =
useState(false);

  const [
  showMakeAdminPopup,

  setShowMakeAdminPopup

] = useState(false);

  const [
    showPasswordPopup,
    setShowPasswordPopup
  ] = useState(false);

  const [
    showDeletePopup,
    setShowDeletePopup
  ] = useState(false);

  return (

    <>

      <div className="options-container">

        {/* UPDATE PASSWORD */}

        <button
          className="option-btn"
          onClick={() =>
            setShowPasswordPopup(true)
          }
        >

          <div>

            <h2 className="option-title">
              Update User Password
            </h2>

            <p className="option-desc">
              Change and manage user account
              passwords securely.
            </p>

          </div>

          <span className="option-number">
            01
          </span>

        </button>

        {/* DELETE USER */}

        <button
          className="option-btn"
          onClick={() =>
            setShowDeletePopup(true)
          }
        >

          <div>

            <h2 className="option-title">
              Delete User
            </h2>

            <p className="option-desc">
              Remove inactive or unwanted
              users permanently from system.
            </p>

          </div>

          <span className="option-number">
            02
          </span>

        </button>

        {/* MAKE ADMIN */}

       <button
  className="option-btn"
  onClick={() =>
    setShowMakeAdminPopup(true)
  }
>

          <div>

            <h2 className="option-title">
              Make User To Admin
            </h2>

            <p className="option-desc">
              Upgrade normal users and
              provide administrator access.
            </p>

          </div>

          <span className="option-number">
            03
          </span>

        </button>

        {/* DELETE ADMIN */}

        <button
  className="option-btn danger"
  onClick={() =>
    setShowDeleteAdminPopup(true)
  }
>

          <div>

            <h2 className="option-title">
              Delete Admin
            </h2>

            <p className="option-desc">
              Permanently remove admin access
              and administrator account.
            </p>

          </div>

          <span className="option-number">
            04
          </span>

        </button>

      </div>

      {/* UPDATE PASSWORD POPUP */}

      {
        showPasswordPopup && (

          <UpdateUserPasswordPopup

            closePopup={() =>
              setShowPasswordPopup(false)
            }

          />
        )
      }

      {/* DELETE USER POPUP */}

      {
        showDeletePopup && (

          <DeleteUserPopup

            closePopup={() =>
              setShowDeletePopup(false)
            }

          />
        )
      }
      {
  showMakeAdminPopup && (

    <MakeUserAdminPopup

      closePopup={() =>
        setShowMakeAdminPopup(false)
      }
      

    />
  )
}
{
  showDeleteAdminPopup && (

    <DeleteAdminPopup

      closePopup={() =>
        setShowDeleteAdminPopup(false)
      }

    />
  )
}

    </>
  );
}

export default OptionsButtons;