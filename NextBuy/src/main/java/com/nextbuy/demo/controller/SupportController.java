package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CreateTicketDto;
import com.nextbuy.demo.dto.MergeTicketDto;
import com.nextbuy.demo.dto.SupportReplyRequestDto;
import com.nextbuy.demo.dto.SupportStatsDto;
import com.nextbuy.demo.entity.SupportTicket;
import com.nextbuy.demo.entity.SupportTicketReply;
import com.nextbuy.demo.enums.TicketStatus;
import com.nextbuy.demo.service.SupportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Support")
public class SupportController {
	
	private SupportService supportService;

	SupportController(SupportService supportService) {
		this.supportService = supportService;

	}

	    // Customer creates ticket
	    @PostMapping("/ticket")
	    @PreAuthorize("hasRole('USER')")
	    public ResponseEntity<String> createTicket(
	            @Valid @RequestBody CreateTicketDto dto, Principal principal) {

	        return ResponseEntity.ok(
	                supportService.createTicket(dto, principal)
	        );
	    }

	    // Customer gets own tickets
	    @GetMapping("/my-tickets")
	    @PreAuthorize("hasRole('USER')")
	    public ResponseEntity<List<SupportTicket>> getMyTickets(
	            Principal principal) {

	        return ResponseEntity.ok(
	                supportService.getMyTickets(principal)
	        );
	    }

	    @GetMapping("/admin/all")
	    @PreAuthorize("hasRole('ADMIN')")
	    public ResponseEntity<List<SupportTicket>> getAllTickets() {

	        return ResponseEntity.ok(
	                supportService.getAllTickets()
	        );
	    }
	
	@PostMapping("/ticket/{ticketId}/reply")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<String> customerReply(
	        @PathVariable Long ticketId,
	        Principal principal,
	        @RequestBody SupportReplyRequestDto dto) {

	    return ResponseEntity.ok(
	            supportService.customerReply(ticketId,principal, dto)
	    );
	}
	
	@PostMapping("/admin/ticket/{ticketId}/reply")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> adminReply(
	        @PathVariable Long ticketId,
	        Principal principal,
	        @RequestBody SupportReplyRequestDto dto) {

	    return ResponseEntity.ok(
	            supportService.adminReply(ticketId,principal, dto)
	    );
	}
	
	@GetMapping("/ticket/{ticketId}/messages")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<List<SupportTicketReply>> getConversation(
	        @PathVariable Long ticketId) {

	    return ResponseEntity.ok(
	            supportService.getConversation(ticketId)
	    );
	}
	
	@PatchMapping("/admin/ticket/{ticketId}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> updateTicketStatus(
	        @PathVariable Long ticketId,
	        @RequestParam TicketStatus status) {

	    return ResponseEntity.ok(
	            supportService.updateTicketStatus(
	                    ticketId,
	                    status
	            )
	    );
	}
	
	@PutMapping("/admin/tickets/{ticketId}/resolve")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> resolveTicket(@PathVariable Long ticketId) {

	    return ResponseEntity.ok(
	            supportService.resolveTicket(ticketId)
	    );
	}

	@PutMapping("/tickets/{ticketId}/reopen")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<String> reopenTicket(@PathVariable Long ticketId) {

	    return ResponseEntity.ok(
	            supportService.reopenTicket(ticketId)
	    );
	}
	
	@GetMapping("/admin/stats")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SupportStatsDto> getStats() {

	    return ResponseEntity.ok(
	            supportService.getSupportStats()
	    );
	}
	
	  @GetMapping("/ticket/{ticketId}")
	  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	    public ResponseEntity<SupportTicket> getTicket(@PathVariable Long ticketId) {
	        return ResponseEntity.ok(supportService.getTicketById(ticketId));
	    }
	  
	  @PostMapping("/admin/tickets/merge")
	  @PreAuthorize("hasRole('ADMIN')")
	  public ResponseEntity<String> mergeTickets(
	          @RequestBody MergeTicketDto dto) {

	      return ResponseEntity.ok(
	              supportService.mergeTickets(
	                      dto.getSourceTicketId(),
	                      dto.getTargetTicketId()
	              )
	      );
	  }
}
