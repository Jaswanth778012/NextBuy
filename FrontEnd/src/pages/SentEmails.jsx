import React, {
  useEffect,
  useState,
} from "react";

import SentEmailList from "../components/adminSentEmails/SentEmailList";

import {
  getAllSentEmails,
} from "../services/adminEmailService";

import { useOutletContext } from "react-router-dom";

import "../styles/SentEmails.css";

function SentEmails() {
  const { sidebarOpen } =
    useOutletContext();

  const [emails, setEmails] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadEmails = async () => {
    try {
      setLoading(true);

      const response =
        await getAllSentEmails();

      setEmails(response.data);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load sent emails."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-status-card">
        <div className="dashboard-loader" />

        <h2>Loading Emails</h2>

        <p>
          Fetching sent email history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          dashboard-status-card
          error-card
        "
      >
        <div className="error-icon">
          📧
        </div>

        <h2>Unable to Load Emails</h2>

        <p>{error}</p>

        <button
          className="retry-btn"
          onClick={loadEmails}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page-content">
      <SentEmailList
        emails={emails}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}

export default SentEmails;