import { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

import { resolveTicket } from "../../services/adminSupportService";


function ResolveTicketModal({
  ticket,
  onClose,
  refreshTickets,
}) {
  const [loading, setLoading] =
    useState(false);

  const handleResolve = async () => {
    try {
      setLoading(true);

      await resolveTicket(ticket.id);

      refreshTickets();

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to resolve ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="resolve-backdrop">

      <div className="resolve-dialog">

        <div className="resolve-header">

          <h2>
            Resolve Ticket
          </h2>

          <button
            className="resolve-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        <div className="resolve-content">

          <div className="resolve-icon">
            <FaCheckCircle />
          </div>

          <h3>
            Mark Ticket #{ticket.id}
            as Resolved?
          </h3>

          <p>
            This ticket will be moved
            to resolved status and no
            further action may be required.
          </p>

        </div>

        <div className="resolve-footer">

          <button
            className="resolve-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="resolve-confirm-btn"
            onClick={handleResolve}
            disabled={loading}
          >
            {loading
              ? "Resolving..."
              : "Resolve Ticket"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResolveTicketModal;