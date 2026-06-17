import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TicketInfoCard from "../components/adminTicketDetail/TicketInfoCard";
import TicketConversation from "../components/adminTicketDetail/TicketConversation";
import AdminReplyBox from "../components/adminTicketDetail/AdminReplyBox";
import SupportLoader from "../components/adminSupport/SupportLoader";

import {
  getTicketById,
  getTicketMessages,
} from "../services/adminSupportService";

import "../styles/TicketDetailsPage.css";

function TicketDetailsPage() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  const loadTicketData = async () => {
    try {
      setLoading(true);

      const [ticketRes, messageRes] =
        await Promise.all([
          getTicketById(ticketId),
          getTicketMessages(ticketId),
        ]);

      setTicket(ticketRes.data);

      setMessages(messageRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SupportLoader />;
  }

  return (
    <div className="support-chat-page">

      <div className="support-chat-header">

        <div>
          <h1>
            Ticket #{ticket.id}
          </h1>

          <p>
            Manage customer
            communication and replies
          </p>
        </div>

      </div>

      <TicketInfoCard ticket={ticket} />

      <TicketConversation
        messages={messages}
      />

      <AdminReplyBox
        ticketId={ticket.id}
        refreshConversation={
          loadTicketData
        }
      />

    </div>
  );
}

export default TicketDetailsPage;