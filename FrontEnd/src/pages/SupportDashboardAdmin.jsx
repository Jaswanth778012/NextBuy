import { useEffect, useState } from "react";
import {FaTicketAlt} from "react-icons/fa"

import SupportStatsCards from "../components/adminSupport/SupportStatsCards";
import SupportSearchBar from "../components/adminSupport/SupportSearchBar";
import SupportTicketTable from "../components/adminSupport/SupportTicketTable";
import SupportPagination from "../components/adminSupport/SupportPagination";
import SupportLoader from "../components/adminSupport/SupportLoader";
import EmptyTickets from "../components/adminSupport/EmptyTickets";

import ResolveTicketModal from "../components/adminSupport/ResolveTicketModal";
import MergeTicketModal from "../components/adminSupport/MergeTicketModal";

import {
  getAllTickets,
  getSupportStats,
} from "../services/adminSupportService";

import "../styles/AdminSupportDashboard.css";

function SupportDashboardAdmin() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [mergeTicket, setMergeTicket] =
    useState(null);

  const [stats, setStats] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, tickets]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ticketRes, statsRes] =
        await Promise.all([
          getAllTickets(),
          getSupportStats(),
        ]);

      setTickets(ticketRes.data);
      setFilteredTickets(ticketRes.data);

      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const keyword =
      search.toLowerCase();

    const result = tickets.filter(
      (ticket) =>
        ticket.id
          ?.toString()
          .includes(keyword) ||
        ticket.subject
          ?.toLowerCase()
          .includes(keyword) ||
        ticket.status
          ?.toLowerCase()
          .includes(keyword) ||
        ticket.category
          ?.toLowerCase()
          .includes(keyword)
    );

    setFilteredTickets(result);
    setPage(1);
  };

  const totalPages = Math.ceil(
    filteredTickets.length /
      rowsPerPage
  );

  const startIndex =
    (page - 1) * rowsPerPage;

  const paginatedTickets =
    filteredTickets.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  if (loading) {
    return <SupportLoader />;
  }

  return (
  <div className="support-hub-page">

    {/* HEADER */}
    <div className="support-hub-header">
      <div>
        <h1>Support Center</h1>

        <p>
          Manage customer support tickets,
          replies and resolutions.
        </p>
      </div>

      <div className="support-header-actions">
        <div className="support-total-card">
          <FaTicketAlt />

          <span>
            {stats?.total ?? 0} Tickets
          </span>
        </div>
      </div>
    </div>

    {/* STATS */}
    <SupportStatsCards stats={stats} />

    {/* SEARCH */}
    <SupportSearchBar
      value={search}
      onChange={setSearch}
    />

    {/* TABLE / EMPTY STATE */}
    {filteredTickets.length === 0 ? (
      <EmptyTickets
        title="No Support Tickets"
        description="No tickets match the current search or filter criteria."
      />
    ) : (
      <>
        <SupportTicketTable
          tickets={paginatedTickets}
          refreshTickets={fetchData}
          setSelectedTicket={setSelectedTicket}
          setMergeTicket={setMergeTicket}
        />

        <SupportPagination
          page={page}
          totalPages={totalPages}
          onPrev={() =>
            setPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          onNext={() =>
            setPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
        />
      </>
    )}

    {/* RESOLVE MODAL */}
    {selectedTicket && (
      <ResolveTicketModal
        ticket={selectedTicket}
        onClose={() =>
          setSelectedTicket(null)
        }
        refreshTickets={fetchData}
      />
    )}

    {/* MERGE MODAL */}
    {mergeTicket && (
      <MergeTicketModal
        ticket={mergeTicket}
        onClose={() =>
          setMergeTicket(null)
        }
        refreshTickets={fetchData}
      />
    )}
  </div>
);
}

export default SupportDashboardAdmin;