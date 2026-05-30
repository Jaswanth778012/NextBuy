import React, { useState } from "react";

import NotificationForm from "../components/adminNotificationEmail/NotificationForm";

import BroadcastEmailForm from "../components/adminNotificationEmail/BroadcastEmailForm";

import SelectedUsersEmailForm from "../components/adminNotificationEmail/SelectedUsersEmailForm";

import ScheduleEmailForm from "../components/adminNotificationEmail/ScheduleEmailForm";

import "../styles/BroadcastCenter.css";

function BroadcastCenter() {

  const [activeTab, setActiveTab] =
    useState("notification");

  return (

    <div className="broadcast-page">

      <div className="broadcast-header">

        <h1>
          Marketing Center
        </h1>

        <p>
          Notifications, emails &
          campaigns
        </p>

      </div>

      <div className="broadcast-tabs">

        <button
          className={
            activeTab === "notification"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "notification"
            )
          }
        >
          Notifications
        </button>

        <button
          className={
            activeTab === "email"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "email"
            )
          }
        >
          Broadcast Email
        </button>

        <button
          className={
            activeTab === "selected"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "selected"
            )
          }
        >
          Selected Users
        </button>

        <button
          className={
            activeTab === "schedule"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "schedule"
            )
          }
        >
          Schedule Email
        </button>

      </div>

      <div className="broadcast-content">

        {activeTab ===
          "notification" && (
          <NotificationForm />
        )}

        {activeTab ===
          "email" && (
          <BroadcastEmailForm />
        )}

        {activeTab ===
          "selected" && (
          <SelectedUsersEmailForm />
        )}

        {activeTab ===
          "schedule" && (
          <ScheduleEmailForm />
        )}

      </div>

    </div>
  );
}

export default BroadcastCenter;