import React, {
  useEffect,
  useState,
} from "react";

import Select from "react-select";

import { toast } from "react-toastify";

import {
  scheduleEmail,
} from "../../services/adminEmailService";

import {
  viewAllUsers,
} from "../../services/adminUserService";

function ScheduleEmailForm() {

  const [users, setUsers] =
    useState([]);

  const [selectedUsers,
    setSelectedUsers] =
    useState([]);

  const [subject,
    setSubject] =
    useState("");

  const [body,
    setBody] =
    useState("");

  const [scheduledTime,
    setScheduledTime] =
    useState("");

  const [scheduling,
    setScheduling] =
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

      if (
        selectedUsers.length === 0
      ) {

        toast.warning(
          "Select at least one user"
        );

        return;
      }

      const toastId =
        toast.loading(
          "Scheduling email..."
        );

      try {

        setScheduling(true);

        await scheduleEmail({
          userIds:
            selectedUsers.map(
              (user) =>
                user.value
            ),
          subject,
          body,
          scheduledTime,
        });

        toast.update(
          toastId,
          {
            render:
              "Email scheduled successfully",
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
        setScheduledTime("");
        setSelectedUsers([]);

      } catch (error) {

        console.error(error);

        toast.update(
          toastId,
          {
            render:
              "Failed to schedule email",
            type:
              "error",
            isLoading:
              false,
            autoClose:
              3000,
          }
        );

      } finally {

        setScheduling(false);
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
          isDisabled={scheduling}
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
        disabled={scheduling}
        required
      />

      <textarea
        rows="8"
        placeholder="Email Content"
        value={body}
        onChange={(e) =>
          setBody(
            e.target.value
          )
        }
        disabled={scheduling}
        required
      />

      <div>

        <label>
          Schedule Date & Time
        </label>

        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) =>
            setScheduledTime(
              e.target.value
            )
          }
          disabled={scheduling}
          required
        />

      </div>

      <button
        type="submit"
        disabled={scheduling}
      >

        {
          scheduling
            ? "Scheduling..."
            : "Schedule Email"
        }

      </button>

    </form>
  );
}

export default ScheduleEmailForm;