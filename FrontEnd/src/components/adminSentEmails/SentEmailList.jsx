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

  const [currentPage, setCurrentPage] =
    useState(1);

  const [emailsPerPage, setEmailsPerPage] =
    useState(10);

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

  const totalPages = Math.ceil(
    filteredEmails.length / emailsPerPage
  );

  const startIndex =
    (currentPage - 1) * emailsPerPage;

  const paginatedEmails =
    filteredEmails.slice(
      startIndex,
      startIndex + emailsPerPage
    );

  return (
    <>
      <div className="sent-emails-page">
        {/* Header */}
        <div className="sent-emails-header">
          <div>
            <h1>Sent Emails</h1>

            <p>
              View all broadcasted and
              scheduled emails
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table Card */}
        <div className="sent-email-table-card">
          <div className="table-wrapper">
            <table className="sent-email-table">
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
                {paginatedEmails.length >
                0 ? (
                  paginatedEmails.map(
                    (email) => {
                      const recipientCount =
                        email.recipients
                          ?.split(",")
                          .filter(
                            (r) =>
                              r.trim() !== ""
                          ).length || 0;

                      return (
                        <tr key={email.id}>
                          <td>{email.id}</td>

                          <td>
                            {email.subject}
                          </td>

                          <td>
                            <span className="email-type-chip">
                              {email.type}
                            </span>
                          </td>

                          <td>
                            {recipientCount}
                          </td>

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
                    }
                  )
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

          {/* Pagination */}
          <div className="sent-pagination-container">
            <div className="sent-pagination-left">
              <span>Rows per page:</span>

              <select
                value={emailsPerPage}
                onChange={(e) => {
                  setEmailsPerPage(
                    Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="sent-pagination-right">
              <button
                className="sent-pagination-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Previous
              </button>

              <div className="sent-page-indicator">
                Page {currentPage} of{" "}
                {totalPages || 1}
              </div>

              <button
                className="sent-pagination-btn"
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

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