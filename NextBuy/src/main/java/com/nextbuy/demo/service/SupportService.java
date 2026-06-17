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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportService {

	private final SupportTicketRepository ticketRepo;
	private final UserRepository userRepo;
	private final NotificationService notificationService;
	private final SupportTicketReplyRepository replyRepo;
	private final EmailService emailService;

	public String createTicket(CreateTicketDto dto, Principal principal) {

		String username = principal.getName();

		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		SupportTicket ticket = new SupportTicket();

		ticket.setUser(user);
		ticket.setSubject(dto.getSubject());
		ticket.setDescription(dto.getDescription());
		ticket.setCategory(dto.getCategory());
		ticket.setStatus(TicketStatus.OPEN);

		ticketRepo.save(ticket);
		
		emailService.sendEmail(
	            user.getEmail(),
	            "Support Ticket Created - #" + ticket.getId(),
	            "Hello " + user.getName() + ",\n\n" +
	            "Your support ticket has been created successfully.\n\n" +
	            "Ticket ID: " + ticket.getId() + "\n" +
	            "Subject: " + ticket.getSubject() + "\n" +
	            "Category: " + ticket.getCategory() + "\n" +
	            "Status: OPEN\n\n" +
	            "Our support team will review your request and get back to you soon.\n\n" +
	            "Thank you,\n" +
	            "NextBuy Support Team"
	    );
		
		

		// Admin notification
		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "New Support Ticket",
				user.getName() + " created a support ticket", ticket.getId(), "TICKET", "HIGH");

		return "Support Ticket Created Successfully";
	}

	public List<SupportTicket> getMyTickets(Principal principal) {

		String username = principal.getName();
		return ticketRepo.findByUserUsername(username);
	}

	public String customerReply(Long ticketId, Principal principal, SupportReplyRequestDto dto) {

	    SupportTicket ticket = ticketRepo.findById(ticketId)
	            .orElseThrow(() -> new RuntimeException("Ticket not found"));

	    if (ticket.getStatus() == TicketStatus.CLOSED) {
	        throw new RuntimeException("Cannot reply to a closed ticket");
	    }

	    String username = principal.getName();

	    User customer = userRepo.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    SupportTicketReply reply = new SupportTicketReply();

	    reply.setTicket(ticket);
	    reply.setSender(customer);
	    reply.setSenderType("CUSTOMER");
	    reply.setMessage(dto.getMessage());

	    replyRepo.save(reply);

	    ticket.setStatus(TicketStatus.IN_PROGRESS);

	    ticketRepo.save(ticket);

	    notificationService.createNotification(
	            NotificationType.SUPPORT_TICKET,
	            "Customer Replied",
	            customer.getName() + " replied to ticket #" + ticket.getId(),
	            ticket.getId(),
	            "TICKET",
	            "MEDIUM");

	    return "Reply Sent Successfully";
	}

	public String adminReply(Long ticketId, Principal principal, SupportReplyRequestDto dto) {

	    SupportTicket ticket = ticketRepo.findById(ticketId)
	            .orElseThrow(() -> new RuntimeException("Ticket not found"));

	    if (ticket.getStatus() == TicketStatus.CLOSED) {
	        throw new RuntimeException("Cannot reply to a closed ticket");
	    }

	    String username = principal.getName();

	    User admin = userRepo.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("Admin not found"));

	    SupportTicketReply reply = new SupportTicketReply();

	    reply.setTicket(ticket);
	    reply.setSender(admin);
	    reply.setSenderType("ADMIN");
	    reply.setMessage(dto.getMessage());

	    replyRepo.save(reply);

	    ticket.setStatus(TicketStatus.WAITING_FOR_CUSTOMER);

	    ticketRepo.save(ticket);

	    return "Reply Sent Successfully";
	}

	public List<SupportTicket> getAllTickets() {

		return ticketRepo.findAll();
	}

	public List<SupportTicketReply> getConversation(Long ticketId) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		return replyRepo.findByTicketIdOrderByCreatedAtAsc(ticket.getId());
	}

	public String updateTicketStatus(Long ticketId, TicketStatus status) {

		SupportTicket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new RuntimeException("Ticket not found"));

		ticket.setStatus(status);
		
		 User user = ticket.getUser();
		
		emailService.sendEmail(
	            user.getEmail(),
	            "Support Ticket Status Updated",
	            "Hello " + user.getName() + ",\n\n" +
	            "Your support ticket #" + ticket.getId() +
	            " has been updated to: " + status +
	            ".\n\nRegards,\nNextBuy Support Team"
	    );

		notificationService.createNotification(NotificationType.SUPPORT_TICKET, "Ticket Status Updated",
				"Ticket #" + ticket.getId() + " marked as " + status, ticket.getId(), "TICKET", "MEDIUM");

		ticketRepo.save(ticket);

		return "Ticket status updated successfully";
	}

	public SupportStatsDto getSupportStats() {
		
		long total = ticketRepo.count();

		long open = ticketRepo.countByStatus(TicketStatus.OPEN);

		long inProgress = ticketRepo.countByStatus(TicketStatus.IN_PROGRESS);

		long resolved = ticketRepo.countByStatus(TicketStatus.RESOLVED);

		long closed = ticketRepo.countByStatus(TicketStatus.CLOSED);
		
		return new SupportStatsDto(
			    total,
			    open,
			    inProgress,
			    resolved,
			    closed
			);
	}
	
	  public SupportTicket getTicketById(Long ticketId) {
	        return ticketRepo.findById(ticketId)
	                .orElseThrow(() -> new RuntimeException(
	                        "Ticket not found with id: " + ticketId
	                ));
	    }
	  
	  public String resolveTicket(Long ticketId) {

		    SupportTicket ticket = ticketRepo.findById(ticketId)
		            .orElseThrow(() -> new RuntimeException("Ticket not found"));

		    ticket.setStatus(TicketStatus.RESOLVED);

		    ticketRepo.save(ticket);
		    
		    User user = ticket.getUser();
		    
		    emailService.sendEmail(
		            user.getEmail(),
		            "Ticket Resolved",
		            "Hello " + user.getName() + ",\n\n" +
		            "Your support ticket #" + ticket.getId() +
		            " has been marked as RESOLVED.\n\n" +
		            "If your issue still exists, you may reopen the ticket.\n\n" +
		            "Regards,\nNextBuy Support Team"
		    );

		    return "Ticket marked as resolved";
		}
	  
	  public String reopenTicket(Long ticketId) {

		    SupportTicket ticket = ticketRepo.findById(ticketId)
		            .orElseThrow(() -> new RuntimeException("Ticket not found"));

		    if (ticket.getStatus() != TicketStatus.RESOLVED) {
		        throw new RuntimeException("Only resolved tickets can be reopened");
		    }

		    ticket.setStatus(TicketStatus.OPEN);

		    ticketRepo.save(ticket);
		    
		    User user = ticket.getUser();

		    emailService.sendEmail(
		            user.getEmail(),
		            "Ticket Reopened",
		            "Hello " + user.getName() + ",\n\n" +
		            "Your support ticket #" + ticket.getId() +
		            " has been reopened and is now under review.\n\n" +
		            "Regards,\nNextBuy Support Team"
		    );

		    return "Ticket reopened successfully";
		}
	  
	  
	  @Transactional
	  public String mergeTickets(
	          Long sourceTicketId,
	          Long targetTicketId) {

	      if (sourceTicketId.equals(targetTicketId)) {
	          throw new RuntimeException(
	                  "Cannot merge same ticket");
	      }

	      SupportTicket source =
	              ticketRepo.findById(sourceTicketId)
	                      .orElseThrow(() ->
	                              new RuntimeException(
	                                      "Source ticket not found"));

	      SupportTicket target =
	              ticketRepo.findById(targetTicketId)
	                      .orElseThrow(() ->
	                              new RuntimeException(
	                                      "Target ticket not found"));

	      if (source.getReplies() != null) {

	          for (SupportTicketReply reply :
	                  source.getReplies()) {

	              reply.setTicket(target);

	              target.getReplies().add(reply);
	          }
	      }

	      source.setMerged(true);

	      source.setMergedInto(target);

	      source.setStatus(
	              TicketStatus.MERGED
	      );

	      ticketRepo.save(source);
	      
	      ticketRepo.save(target);

	      return "Tickets merged successfully";
	  }
}
