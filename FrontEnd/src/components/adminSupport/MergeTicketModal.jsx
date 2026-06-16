import { useState } from "react";

import {
  FaCodeBranch,
  FaTimes,
} from "react-icons/fa";

import { mergeTickets } from "../../services/adminSupportService";


function MergeTicketModal({
  ticket,
  onClose,
  refreshTickets,
}) {
  const [targetTicketId, setTargetTicketId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleMerge = async () => {
    if (!targetTicketId) {
      alert("Please enter target ticket id");
      return;
    }

    try {
      setLoading(true);

      await mergeTickets(
        ticket.id,
        Number(targetTicketId)
      );

      refreshTickets();

      onClose();
    } catch (error) {
      console.error(error);

      alert("Failed to merge tickets");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="merge-overlay">

      <div className="merge-modal">

        <div className="merge-header">

          <h2>Merge Tickets</h2>

          <button
            className="merge-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        <div className="merge-content">

          <div className="merge-icon">
            <FaCodeBranch />
          </div>

          <div className="merge-info-card">

            <label>
              Source Ticket
            </label>

            <div className="merge-ticket-box">
              #{ticket.id}
            </div>

          </div>

          <div className="merge-info-card">

            <label>
              Target Ticket ID
            </label>

            <input
              type="number"
              value={targetTicketId}
              onChange={(e) =>
                setTargetTicketId(
                  e.target.value
                )
              }
              placeholder="Enter ticket id"
            />

          </div>

          <div className="merge-warning">

            ⚠ All replies and ticket
            history from source ticket
            will be moved into the
            target ticket.

          </div>

        </div>

        <div className="merge-footer">

          <button
            className="merge-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="merge-confirm-btn"
            disabled={loading}
            onClick={handleMerge}
          >
            {loading
              ? "Merging..."
              : "Merge Tickets"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default MergeTicketModal;