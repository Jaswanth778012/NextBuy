import { useState } from "react";

import { FaSyncAlt } from "react-icons/fa";

import { updateTicketStatus } from "../../services/adminSupportService";

function TicketStatusDropdown({
  ticketId,
  currentStatus,
  refreshTickets,
}) {
  const [status, setStatus] =
    useState(currentStatus);

  const [loading, setLoading] =
    useState(false);

  const handleStatusChange = async (
    e
  ) => {
    const newStatus = e.target.value;

    try {
      setLoading(true);

      await updateTicketStatus(
        ticketId,
        newStatus
      );

      setStatus(newStatus);

      refreshTickets();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update ticket status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-editor-wrapper">

      <select
        value={status}
        disabled={loading}
        onChange={handleStatusChange}
        className="status-editor-select"
      >
        <option value="OPEN">
          OPEN
        </option>

        <option value="IN_PROGRESS">
          IN PROGRESS
        </option>

        <option value="WAITING_FOR_CUSTOMER">
          WAITING FOR CUSTOMER
        </option>

        <option value="RESOLVED">
          RESOLVED
        </option>

        <option value="CLOSED">
          CLOSED
        </option>
      </select>

      {loading && (
        <FaSyncAlt className="status-spin-icon" />
      )}

    </div>
  );
}

export default TicketStatusDropdown;