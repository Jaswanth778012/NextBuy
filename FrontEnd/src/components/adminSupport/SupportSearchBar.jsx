import { FaSearch } from "react-icons/fa";

function SupportSearchBar({
  value,
  onChange,
}) {
  return (
    <div className="ticket-filter-section">
      <div className="ticket-filter-box">

        <FaSearch
          className="ticket-filter-icon"
        />

        <input
          type="text"
          placeholder="
            Search by Ticket ID,
            Subject,
            Status,
            Category...
          "
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />

      </div>
    </div>
  );
}

export default SupportSearchBar;