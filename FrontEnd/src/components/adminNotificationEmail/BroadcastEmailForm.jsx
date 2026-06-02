import React, { useState } from "react";

import { sendEmailToAll } from "../../services/adminEmailService";

import { toast } from "react-toastify";

function BroadcastEmailForm() {
  const [subject, setSubject] = useState("");

  const [content, setContent] = useState("");

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sending) return;

    const toastId = toast.loading(
      "Sending emails..."
    );

    try {
      setSending(true);

      await sendEmailToAll({
        subject,
        body: content,
      });

      toast.update(toastId, {
        render:
          "Email sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setSubject("");
      setContent("");
    } catch (error) {
      console.error(error);

      toast.update(toastId, {
        render:
          "Failed to send email",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      className="broadcast-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Subject"
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
        rows="10"
        placeholder="Email Content"
        value={content}
        onChange={(e) =>
          setContent(
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
        {sending
          ? "Sending Emails..."
          : "Send To All Users"}
      </button>
    </form>
  );
}

export default BroadcastEmailForm;