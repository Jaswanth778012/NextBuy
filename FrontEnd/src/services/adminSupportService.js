import API from "./api";

/* =========================================
   TICKETS
========================================= */

export const getAllTickets = () => {
  return API.get("/Support/admin/all");
};

export const getTicketById = (ticketId) => {
  return API.get(
    `/Support/ticket/${ticketId}`
  );
};

export const getTicketMessages = (ticketId) => {
  return API.get(
    `/Support/ticket/${ticketId}/messages`
  );
};

/* =========================================
   ADMIN REPLY
========================================= */

export const adminReply = (
  ticketId,
  payload
) => {
  return API.post(
    `/Support/admin/ticket/${ticketId}/reply`,
    payload
  );
};

/* =========================================
   STATUS
========================================= */

export const updateTicketStatus = (
  ticketId,
  status
) => {
  return API.patch(
    `/Support/admin/ticket/${ticketId}/status`,
    null,
    {
      params: {
        status,
      },
    }
  );
};

export const resolveTicket = (
  ticketId
) => {
  return API.put(
    `/Support/admin/tickets/${ticketId}/resolve`
  );
};

/* =========================================
   MERGE
========================================= */

export const mergeTickets = (
  sourceTicketId,
  targetTicketId
) => {
  return API.post(
    "/Support/admin/tickets/merge",
    {
      sourceTicketId,
      targetTicketId,
    }
  );
};

/* =========================================
   STATS
========================================= */

export const getSupportStats = () => {
  return API.get(
    "/Support/admin/stats"
  );
};