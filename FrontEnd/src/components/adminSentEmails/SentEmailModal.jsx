import React from "react";

function SentEmailModal({
  email,
  onClose,
  sidebarOpen,
}) {
  if (!email) return null;

  const recipientList = email.recipients
    ? email.recipients
        .split(",")
        .map((recipient) =>
          recipient.trim()
        )
        .filter(Boolean)
    : [];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className={`modal-content ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <h2>Email Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* INFO CARDS */}
        <div className="email-details-grid">
          <div className="email-info-card">
            <strong>ID</strong>
            <p>{email.id}</p>
          </div>

          <div className="email-info-card">
            <strong>Type</strong>
            <p>{email.type}</p>
          </div>

          <div className="email-info-card">
            <strong>Recipients</strong>
            <p>{recipientList.length}</p>
          </div>

          <div className="email-info-card">
            <strong>Sent At</strong>
            <p>
              {email.sentAt
                ? new Date(
                    email.sentAt
                  ).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

        {/* SUBJECT */}
        <div className="email-section">
          <h3>Subject</h3>

          <div className="email-body">
            {email.subject}
          </div>
        </div>

        {/* BODY */}
        <div className="email-section">
          <h3>Email Body</h3>

          <div className="email-body email-content-box">
            {email.body}
          </div>
        </div>

        {/* RECIPIENTS */}
        <div className="email-section">
          <h3>
            Recipients (
            {recipientList.length})
          </h3>

          <div className="recipient-list">
            {recipientList.length >
            0 ? (
              recipientList.map(
                (
                  recipient,
                  index
                ) => (
                  <div
                    key={index}
                    className="recipient-chip"
                  >
                    {recipient}
                  </div>
                )
              )
            ) : (
              <p>
                No recipients found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentEmailModal;