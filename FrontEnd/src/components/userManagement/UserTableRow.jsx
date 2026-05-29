import React from "react";

function UserTableRow({
  user,
}) {

  return (

    <tr>

      <td>
        #{user.id}
      </td>

      <td>

        <div className="user-info-cell">

          <div className="user-avatar">

            {user.imgUrl ? (

              <img
                src={user.imgUrl}
                alt={user.name}
                className="user-avatar-img"
              />

            ) : (

              <span>

                {user.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </span>

            )}

          </div>

          <div>

            <h4>
              {user.name}
            </h4>

            <p>
              @{user.username}
            </p>

          </div>

        </div>

      </td>

      <td className="email-cell">
        {user.email}
      </td>

      <td>
        {user.mobileNumber}
      </td>

      <td>

        <span className="gender-badge">

          {user.gender}

        </span>

      </td>

      <td className="location-cell">

        <div className="location-info">

          <span>
            {user.address || "N/A"}
          </span>

          <small>
            {user.state ||
              "Unknown State"}
          </small>

        </div>

      </td>

      <td>

        <span className="orders-chip">

          {user.totalOrders}

        </span>

      </td>

      <td>

        <div className="spent-cell">

          ₹
          {user.totalSpent?.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
            }
          )}

        </div>

      </td>

      <td>

        <div className="date-info">

          {user.createdAt}

        </div>

      </td>

      <td>

        <div className="login-info">

          {user.lastLogin
            ? new Date(
                user.lastLogin
              ).toLocaleString()
            : "Never"}

        </div>

      </td>

    </tr>
  );
}

export default UserTableRow;