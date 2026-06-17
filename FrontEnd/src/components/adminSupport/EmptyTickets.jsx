import { FaInbox } from "react-icons/fa";

function EmptyTickets({
  title = "No Tickets Found",
  description =
    "There are currently no support tickets available.",
}) {
  return (
    <div className="ticket-empty-shell">

      <div className="ticket-empty-icon">
        <FaInbox />
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

    </div>
  );
}

export default EmptyTickets;