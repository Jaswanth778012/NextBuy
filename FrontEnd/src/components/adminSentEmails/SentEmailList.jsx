import React, { useMemo, useState } from "react";
import SentEmailModal from "./SentEmailModal";
import "../../styles/SentEmails.css";

function SentEmailList({
  emails,
  sidebarOpen,
}) {
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] =
    useState(null);

  const filteredEmails = useMemo(() => {
    return emails.filter(
      (email) =>
        email.subject
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        email.type
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [emails, search]);

  return (
    <>
      <div className="sent-emails-page">
        {/* Header */}
        <div className="sent-emails-header">
          <div>
            <h1>Sent Emails</h1>

            <p>
              View all broadcasted and scheduled
              emails
            </p>
          </div>

          <div className="sent-email-count">
            {filteredEmails.length} Emails
          </div>
        </div>

        {/* Search */}
        <div className="sent-email-search">
          <input
            type="text"
            placeholder="Search by subject or type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Recipients</th>
                <th>Sent At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => {
                  const recipientCount =
                    email.recipients
                      ?.split(",")
                      .filter(
                        (r) => r.trim() !== ""
                      ).length || 0;

                  return (
                    <tr key={email.id}>
                      <td>{email.id}</td>

                      <td>{email.subject}</td>

                      <td>
                        <span className="email-type-chip">
                          {email.type}
                        </span>
                      </td>

                      <td>{recipientCount}</td>

                      <td>
                        {email.sentAt
                          ? new Date(
                              email.sentAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        <button
                          className="view-email-btn"
                          onClick={() =>
                            setSelectedEmail(
                              email
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-email-row"
                  >
                    No emails found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <SentEmailModal
        email={selectedEmail}
        onClose={() =>
          setSelectedEmail(null)
        }
        sidebarOpen={sidebarOpen}
      />
    </>
  );
}

export default SentEmailList;