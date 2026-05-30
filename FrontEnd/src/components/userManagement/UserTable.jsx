import React from "react";

import UserTableRow from "./UserTableRow";

function UserTable({
  currentUsers,
}) {

  return (

    <div className="users-table-card">

      <div className="table-wrapper">

        <table className="users-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>User</th>

              <th>Email</th>

              <th>Mobile</th>

              <th>Gender</th>

              <th>Location</th>

              <th>Orders</th>

              <th>Total Spent</th>

              <th>Joined</th>

              <th>Last Login</th>

            </tr>

          </thead>

          <tbody>

            {currentUsers.length > 0 ? (

              currentUsers.map(
                (user) => (

                  <UserTableRow
                    key={user.id}
                    user={user}
                  />

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="10"
                  className="empty-users"
                >

                  No Users Found 🚫

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UserTable;