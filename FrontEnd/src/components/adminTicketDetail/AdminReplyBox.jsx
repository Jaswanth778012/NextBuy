import { useState } from "react";

import {
  FaPaperPlane,
} from "react-icons/fa";

import {
  adminReply,
} from "../../services/adminSupportService";


function AdminReplyBox({
  ticketId,
  refreshConversation,
}) {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      setLoading(true);

      await adminReply(ticketId, {
        message,
      });

      setMessage("");

      refreshConversation();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to send reply."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reply-panel-card">

      <div className="reply-panel-header">
        <h3>
          Reply to Customer
        </h3>
      </div>

      <div className="reply-panel-body">

        <textarea
          value={message}
          placeholder="
            Type your reply here...
          "
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
        />

      </div>

      <div className="reply-panel-footer">

        <button
          disabled={
            loading ||
            !message.trim()
          }
          onClick={handleSubmit}
          className="reply-send-btn"
        >

          <FaPaperPlane />

          <span>
            {loading
              ? "Sending..."
              : "Send Reply"}
          </span>

        </button>

      </div>

    </div>
  );
}

export default AdminReplyBox;