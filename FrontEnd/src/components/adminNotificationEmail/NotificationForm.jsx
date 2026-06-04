import React, {
  useState,
} from "react";

import {
  sendNotification,
} from "../../services/adminEmailService";

import {
  toast,
} from "react-toastify";

function NotificationForm() {

  const [title,
    setTitle] =
    useState("");

  const [message,
    setMessage] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await sendNotification({
          title,
          message,
        });

        toast.success(
          "Notification sent"
        );

        setTitle("");

        setMessage("");

      } catch {

        toast.error(
          "Failed"
        );
      }
    };

  return (

    <form
      className="broadcast-form"
      onSubmit={
        handleSubmit
      }
    >

      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      <textarea
        rows="6"
        placeholder="Message"
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
      />

      <button type="submit">

        Send Notification

      </button>

    </form>
  );
}

export default NotificationForm;