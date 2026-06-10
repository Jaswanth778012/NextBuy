package com.nextbuy.demo.service;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CreateTicketDto;
import com.nextbuy.demo.dto.SupportReplyRequestDto;
import com.nextbuy.demo.dto.SupportStatsDto;
import com.nextbuy.demo.entity.NotificationType;
import com.nextbuy.demo.entity.SupportTicket;
import com.nextbuy.demo.entity.SupportTicketReply;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.TicketStatus;
import com.nextbuy.demo.repository.SupportTicketReplyRepository;
import com.nextbuy.demo.repository.SupportTicketRepository;
import com.nextbuy.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportService {

	private final SupportTicketRepository ticketRepo;
	private final UserRepository userRepo;
	private final NotificationService notificationService;
	private final SupportTicketReplyRepository replyRepo;

	public String createTicket(CreateTicketDto dto, Principal principal) {

		String username = principal.getName();

		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		SupportTicket ticket = new SupportTicket();

		ticket.setUser(user);
		ticket.setSubject(dto.getSubject());
		ticket.setDescription(dto.getDescription());
		ticket.setCategory(dto.getCategory());

		ticketRepo.save(ticket);

		// Admin notification
		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "New Support Ticket",
				user.getName() + " created a support ticket", ticket.getId(), "TICKET", "HIGH");

		return "Support Ticket Created Successfully";
	}

	public List<SupportTicket> getMyTickets(Long userId) {

		return ticketRepo.findByUserId(userId);
	}

	public String customerReply(Long ticketId, Principal principal, SupportReplyRequestDto dto) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		String username = principal.getName();

		User customer = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		SupportTicketReply reply = new SupportTicketReply();

		reply.setTicket(ticket);
		reply.setSender(customer);
		reply.setSenderType("CUSTOMER");
		reply.setMessage(dto.getMessage());

		replyRepo.save(reply);

		if (ticket.getStatus() == TicketStatus.OPEN) {

			ticket.setStatus(TicketStatus.IN_PROGRESS);

			ticketRepo.save(ticket);
		}

		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "Customer Replied",
				customer.getName() + " replied to ticket #" + ticket.getId(), ticket.getId(), "TICKET", "MEDIUM");

		return "Reply Sent Successfully";
	}

	public String adminReply(Long ticketId, Principal principal, SupportReplyRequestDto dto) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		String username = principal.getName();

		User admin = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Admin not found"));

		SupportTicketReply reply = new SupportTicketReply();

		reply.setTicket(ticket);
		reply.setSender(admin);
		reply.setSenderType("ADMIN");
		reply.setMessage(dto.getMessage());

		replyRepo.save(reply);

		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "Support Team Replied",
				"A new reply was added to your ticket #" + ticket.getId(), ticket.getId(), "TICKET", "MEDIUM");

		ticket.setStatus(TicketStatus.IN_PROGRESS);
		ticketRepo.save(ticket);

		return "Reply Sent Successfully";
	}

	public List<SupportTicket> getAllTickets() {

		return ticketRepo.findAll();
	}

	public List<SupportTicketReply> getConversation(Long ticketId) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		return replyRepo.findBySupportTicketIdOrderByCreatedAtAsc(ticket.getId());
	}

	public String updateTicketStatus(Long ticketId, TicketStatus status) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		ticket.setStatus(status);

		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "Ticket Status Updated",
				"Ticket #" + ticket.getId() + " marked as " + status, ticket.getId(), "TICKET", "MEDIUM");

		ticketRepo.save(ticket);

		return "Ticket status updated successfully";
	}

	public SupportStatsDto getSupportStats() {

		long open = ticketRepo.countByStatus(TicketStatus.OPEN);

		long inProgress = ticketRepo.countByStatus(TicketStatus.IN_PROGRESS);

		long resolved = ticketRepo.countByStatus(TicketStatus.RESOLVED);

		long closed = ticketRepo.countByStatus(TicketStatus.CLOSED);

		return new SupportStatsDto(open, inProgress, resolved, closed);
	}
	
	  public SupportTicket getTicketById(Long ticketId) {
	        return ticketRepo.findById(ticketId)
	                .orElseThrow(() -> new RuntimeException(
	                        "Ticket not found with id: " + ticketId
	                ));
	    }
}
