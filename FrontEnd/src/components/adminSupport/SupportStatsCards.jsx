import {
  FaTicketAlt,
  FaFolderOpen,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

function SupportStatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Open",
      value: stats.open,
      icon: <FaFolderOpen />,
      className: "support-summary-card open-card",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <FaSpinner />,
      className: "support-summary-card progress-card",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: <FaCheckCircle />,
      className: "support-summary-card resolved-card",
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: <FaCheckCircle />,
      className: "support-summary-card closed-card",
    },
  ];

  return (
    <div className="support-summary-grid">
      {cards.map((card, index) => (
        <div key={index} className={card.className}>
          <div className="support-summary-icon">
            {card.icon}
          </div>

          <div className="support-summary-content">
            <h4>{card.title}</h4>
            <h2>{card.value ?? 0}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SupportStatsCards;