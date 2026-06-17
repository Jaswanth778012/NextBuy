function TicketConversation({
  messages = [],
}) {
  return (
    <div className="support-thread-card">

      <div className="support-thread-header">
        <h3>
          Conversation
        </h3>
      </div>

      <div className="support-thread-body">

        {!messages.length && (
          <div className="thread-empty-state">
            No messages found.
          </div>
        )}

        {messages.map((msg) => {

          const isAdmin =
            msg.senderType === "ADMIN";

          return (
            <div
              key={msg.id}
              className={`thread-message-row ${
                isAdmin
                  ? "thread-admin-row"
                  : "thread-user-row"
              }`}
            >

              <div
                className={`thread-message-bubble ${
                  isAdmin
                    ? "thread-admin-bubble"
                    : "thread-user-bubble"
                }`}
              >

                {/* HEADER */}

                <div className="thread-message-top">

                  <div className="thread-sender-section">

                    {msg.sender?.dpUrl ? (
                      <img
                        src={msg.sender.dpUrl}
                        alt={msg.sender?.name}
                        className="thread-avatar"
                      />
                    ) : (
                      <div className="thread-avatar-placeholder">
                        {msg.sender?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}

                    <div className="thread-sender-info">

                      <span className="thread-sender">
                        {msg.sender?.name ||
                          (isAdmin
                            ? "Admin"
                            : "Customer")}
                      </span>

                      <span className="thread-role">
                        {msg.senderType}
                      </span>

                    </div>

                  </div>

                  <span className="thread-time">
                    {new Date(
                      msg.createdAt
                    ).toLocaleString()}
                  </span>

                </div>

                {/* MESSAGE */}

                <div className="thread-message-content">
                  {msg.message}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default TicketConversation;