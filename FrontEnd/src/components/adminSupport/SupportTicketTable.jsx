import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaCheck,
  FaCodeBranch,
} from "react-icons/fa";

import TicketStatusDropdown from "./TicketStatusDropdown";

function SupportTicketTable({
  tickets,
  refreshTickets,
  setSelectedTicket,
  setMergeTicket,
}) {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "status-open";

      case "IN_PROGRESS":
        return "status-progress";

      case "WAITING_FOR_CUSTOMER":
        return "status-waiting";

      case "RESOLVED":
        return "status-resolved";

      case "CLOSED":
        return "status-closed";

      default:
        return "";
    }
  };

  if (!tickets.length) {
    return (
      <div className="ticket-empty-card">
        No support tickets found.
      </div>
    );
  }

  return (
    
    <div className="ticket-data-shell">

      <div className="ticket-data-wrapper">

        <table className="ticket-admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.id}>

                <td>
                  #{ticket.id}
                </td>

                <td>
                  <div className="ticket-subject">
                    {ticket.subject}
                  </div>
                </td>

                <td>
                  {ticket.category}
                </td>

                <td>

                  <div
                    className={`ticket-status-badge ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </div>

                  <TicketStatusDropdown
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    refreshTickets={refreshTickets}
                  />

                </td>

                <td>
                  {ticket.createdAt
                    ?.split("T")[0]}
                </td>

                <td>
                  {ticket.updatedAt
                    ?.split("T")[0]}
                </td>

                <td>

                  <div className="ticket-action-group">

                    {/* VIEW */}

                    <button
                      className="ticket-btn ticket-view-btn"
                      onClick={() =>
                        navigate(
                          `/admin/support/${ticket.id}`
                        )
                      }
                    >
                      <FaEye />
                    </button>

                    {/* RESOLVE */}

                   <button
  className="ticket-btn ticket-resolve-btn"
  onClick={() =>
    setSelectedTicket(ticket)
  }
>
    
  <FaCheck />
</button>

                    {/* MERGE */}
<button
  className="ticket-btn ticket-merge-btn"
  onClick={() =>
    setMergeTicket(ticket)
  }
>
  <FaCodeBranch />
</button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default SupportTicketTable;