import React, {
  useEffect,
  useState,
} from "react";

import {
  viewAllUsers,
  searchUser,
} from "../services/adminUserService";

import {
  useOutletContext,
} from "react-router-dom";

import {
  FaUsers,
} from "react-icons/fa";

import UserSearchBar from "../components/userManagement/UserSearchBar";
import UserTable from "../components/userManagement/UserTable";
import UserPagination from "../components/userManagement/UserPagination";

import "../styles/UserManagement.css";

function UserManagement() {

  const {
    sidebarOpen,
    theme,
  } = useOutletContext();

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchUsername,
    setSearchUsername] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [usersPerPage,
    setUsersPerPage] =
    useState(10);

  // FETCH USERS

  const fetchUsers =
    async () => {

      try {

        setLoading(true);

        const response =
          await viewAllUsers();

        setUsers(response.data);

      } catch (error) {

        console.error(
          "Error fetching users",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchUsers();

  }, []);

  // SEARCH

  const handleSearch =
    async () => {

      if (!searchUsername.trim()) {

        fetchUsers();

        return;
      }

      try {

        setLoading(true);

        const response =
          await searchUser(
            searchUsername
          );

        setUsers([
          response.data
        ]);

        setCurrentPage(1);

      } catch {

        setUsers([]);

      } finally {

        setLoading(false);
      }
    };

  // PAGINATION

  const indexOfLastUser =
    currentPage * usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage;

  const currentUsers =
    users.slice(
      indexOfFirstUser,
      indexOfLastUser
    );

  const totalPages =
    Math.ceil(
      users.length / usersPerPage
    );

  if (loading) {

    return (

      <div
        className={`user-management-page ${
          theme === "dark"
            ? "dark-mode"
            : ""
        }`}
      >

        <div className="dashboard-status-card">

          <div className="dashboard-loader"></div>

          <h2>
            Loading Users
          </h2>

          <p>
            Fetching user records...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div
      className={`user-management-page ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      } ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      {/* HEADER */}

      <div className="users-header">

        <div>

          <h1>
            User Management
          </h1>

          <p>
            Manage users, orders &
            spending analytics
          </p>

        </div>

        <div className="users-count">

          <FaUsers />

          <span>
            {users.length} Users
          </span>

        </div>

      </div>

      {/* SEARCH */}

      <UserSearchBar
        searchUsername={
          searchUsername
        }
        setSearchUsername={
          setSearchUsername
        }
        handleSearch={
          handleSearch
        }
        fetchUsers={
          fetchUsers
        }
        setCurrentPage={
          setCurrentPage
        }
      />

      {/* TABLE */}

      <UserTable
        currentUsers={
          currentUsers
        }
      />

      {/* PAGINATION */}

      <UserPagination
        currentPage={
          currentPage
        }
        totalPages={
          totalPages
        }
        usersPerPage={
          usersPerPage
        }
        setUsersPerPage={
          setUsersPerPage
        }
        setCurrentPage={
          setCurrentPage
        }
      />

    </div>
  );
}

export default UserManagement;