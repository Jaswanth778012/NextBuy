import React, { useEffect, useState } from "react";

import {
  viewAllUsers,
  searchUser,
  deleteUser,
  updateUserPassword,
} from "../services/adminUserService";

function UserManagement() {

  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] =
    useState("");

  const [passwords, setPasswords] =
    useState({});

  // Fetch All Users

  const fetchUsers = async () => {
    try {

      const response =
        await viewAllUsers();

      setUsers(response.data);

    } catch (error) {

      console.error(
        "Error fetching users",
        error
      );
    }
  };

  // Load Users

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search User

  const handleSearch = async () => {

    if (!searchUsername) {
      fetchUsers();
      return;
    }

    try {

      const response =
        await searchUser(searchUsername);

      setUsers([response.data]);

    } catch (error) {

      console.error("User not found");

      setUsers([]);
    }
  };

  // Delete User

  const handleDelete = async (username) => {

    try {

      await deleteUser(username);

      alert("User deleted successfully");

      fetchUsers();

    } catch (error) {

      console.error(
        "Delete failed",
        error
      );
    }
  };

  // Update Password

  const handleUpdatePassword =
    async (username) => {

      try {

        await updateUserPassword(
          username,
          passwords[username]
        );

        alert(
          "Password updated successfully"
        );

        setPasswords({
          ...passwords,
          [username]: "",
        });

      } catch (error) {

        console.error(
          "Password update failed",
          error
        );
      }
    };

  return (

    <div className="user-management-container">

      <h2>User Management</h2>

      {/* Search */}

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search username"
          value={searchUsername}
          onChange={(e) =>
            setSearchUsername(
              e.target.value
            )
          }
        />

        <button onClick={handleSearch}>
          Search
        </button>

        <button onClick={fetchUsers}>
          Reset
        </button>

      </div>

      {/* Table */}

      <table className="user-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Gender</th>
            <th>Address</th>
            <th>DOB</th>
            <th>Total Orders</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.gender}</td>
              <td>{user.address}</td>
              <td>{user.dob}</td>
              <td>{user.totalOrders}</td>

              {/* Password */}

              <td>

                <input
                  type="password"
                  placeholder="New Password"
                  value={
                    passwords[user.username] || ""
                  }
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      [user.username]:
                        e.target.value,
                    })
                  }
                  className="password-input"
                />

              </td>

              {/* Buttons */}

              <td className="action-buttons">

                <button
                  className="update-btn"
                  onClick={() =>
                    handleUpdatePassword(
                      user.username
                    )
                  }
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      user.username
                    )
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UserManagement;