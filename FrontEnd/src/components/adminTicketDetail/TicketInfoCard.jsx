function TicketInfoCard({ ticket }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "ticket-state-open";

      case "IN_PROGRESS":
        return "ticket-state-progress";

      case "WAITING_FOR_CUSTOMER":
        return "ticket-state-waiting";

      case "RESOLVED":
        return "ticket-state-resolved";

      case "CLOSED":
        return "ticket-state-closed";

      default:
        return "";
    }
  };

  return (
    <div className="ticket-summary-card">

      <div className="ticket-summary-top">

        <div>
          <h2>
            {ticket.subject}
          </h2>

          <p>
            Ticket #{ticket.id}
          </p>
        </div>

        <div
          className={`ticket-state-chip ${getStatusClass(
            ticket.status
          )}`}
        >
          {ticket.status}
        </div>

      </div>

      <div className="ticket-summary-grid">

        <div className="ticket-detail-box">
          <label>Category</label>
          <span>
            {ticket.category}
          </span>
        </div>

        <div className="ticket-detail-box">
          <label>Created</label>
          <span>
            {ticket.createdAt?.replace(
              "T",
              " "
            )}
          </span>
        </div>

        <div className="ticket-detail-box">
          <label>Updated</label>
          <span>
            {ticket.updatedAt?.replace(
              "T",
              " "
            )}
          </span>
        </div>

        <div className="ticket-detail-box">
          <label>Ticket ID</label>
          <span>
            #{ticket.id}
          </span>
        </div>

      </div>

    </div>
  );
}

export default TicketInfoCard;