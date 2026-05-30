import React, {
  useEffect,
  useState,
} from "react";

import Select from "react-select";

import { toast } from "react-toastify";

import {
  sendEmailToSelectedUsers,
} from "../../services/adminEmailService";

import {
  viewAllUsers,
} from "../../services/adminUserService";

function SelectedUsersEmailForm() {

  const [users, setUsers] =
    useState([]);

  const [selectedUsers,
    setSelectedUsers] =
    useState([]);

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const [sending, setSending] =
    useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers =
    async () => {

      try {

        const response =
          await viewAllUsers();

        setUsers(
          response.data
        );

      } catch {

        toast.error(
          "Failed to load users"
        );
      }
    };

  const userOptions =
    users.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    }));

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (sending) return;

      if (
        selectedUsers.length === 0
      ) {

        toast.warning(
          "Select users first"
        );

        return;
      }

      const toastId =
        toast.loading(
          "Sending emails..."
        );

      try {

        setSending(true);

        await sendEmailToSelectedUsers({
          userIds:
            selectedUsers.map(
              (user) =>
                user.value
            ),
          subject,
          body,
        });

        toast.update(
          toastId,
          {
            render:
              "Emails sent successfully",
            type:
              "success",
            isLoading:
              false,
            autoClose:
              3000,
          }
        );

        setSubject("");
        setBody("");
        setSelectedUsers([]);

      } catch (error) {

        console.error(error);

        toast.update(
          toastId,
          {
            render:
              "Failed to send emails",
            type:
              "error",
            isLoading:
              false,
            autoClose:
              3000,
          }
        );

      } finally {

        setSending(false);
      }
    };

  return (

    <form
      className="broadcast-form"
      onSubmit={handleSubmit}
    >

      <div className="user-select-container">

        <label className="select-label">
          Select Users
        </label>

        <Select
          isMulti
          options={userOptions}
          value={selectedUsers}
          onChange={(selected) =>
            setSelectedUsers(
              selected || []
            )
          }
          placeholder="Search users..."
          isDisabled={sending}
          classNamePrefix="react-select"
        />

      </div>

      <input
        type="text"
        placeholder="Email Subject"
        value={subject}
        onChange={(e) =>
          setSubject(
            e.target.value
          )
        }
        disabled={sending}
        required
      />

      <textarea
        rows="8"
        placeholder="Email Body"
        value={body}
        onChange={(e) =>
          setBody(
            e.target.value
          )
        }
        disabled={sending}
        required
      />

      <button
        type="submit"
        disabled={sending}
      >
        {
          sending
            ? "Sending Emails..."
            : "Send To Selected Users"
        }
      </button>

    </form>
  );
}

export default SelectedUsersEmailForm;