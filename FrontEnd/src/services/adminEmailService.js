import API from "./API";

export const sendNotification = (data) =>
  API.post(
    "/Admin/broadcast/notification",
    data
  );

export const sendEmailToAll = (data) =>
  API.post(
    "/Admin/broadcast/email",
    data
  );

export const sendEmailToSelectedUsers = (data) =>
  API.post(
    "/Admin/selected-users",
    data
  );

export const scheduleEmail = (data) =>
  API.post(
    "/Admin/schedule",
    data
  );

 export const getAllSentEmails = () =>
  API.get(
    "/Admin/sent-emails"
  );