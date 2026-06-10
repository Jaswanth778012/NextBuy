package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CreateTicketDto;
import com.nextbuy.demo.dto.SupportReplyRequestDto;
import com.nextbuy.demo.dto.SupportStatsDto;
import com.nextbuy.demo.dto.TicketStatusDto;
import com.nextbuy.demo.entity.SupportTicket;
import com.nextbuy.demo.entity.SupportTicketReply;
import com.nextbuy.demo.repository.SupportTicketReplyRepository;
import com.nextbuy.demo.repository.SupportTicketRepository;
import com.nextbuy.demo.service.SupportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Support")
public class SupportController {
	
	private SupportService supportService;
	private SupportTicketRepository supportTicketRepository;
	private SupportTicketReplyRepository supportTicketReplyRepository;
	
	SupportController(SupportService supportService, SupportTicketRepository supportTicketRepository, SupportTicketReplyRepository supportTicketReplyRepository) {
		this.supportService = supportService;
		this.supportTicketRepository = supportTicketRepository;
		this.supportTicketReplyRepository = supportTicketReplyRepository;
		
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
	    @GetMapping("/my-tickets/{userId}")
	    @PreAuthorize("hasRole('USER')")
	    public ResponseEntity<List<SupportTicket>> getMyTickets(
	            @PathVariable Long userId) {

	        return ResponseEntity.ok(
	                supportService.getMyTickets(userId)
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
	public ResponseEntity<List<SupportTicketReply>> getConversation(
	        @PathVariable Long ticketId) {

	    return ResponseEntity.ok(
	            supportService.getConversation(ticketId)
	    );
	}
	
	@PatchMapping("/admin/ticket/{ticketId}/status")
	public ResponseEntity<String> updateTicketStatus(
	        @PathVariable Long ticketId,
	        @RequestBody TicketStatusDto dto) {

	    return ResponseEntity.ok(
	            supportService.updateTicketStatus(
	                    ticketId,
	                    dto.getStatus()
	            )
	    );
	}
	
	@GetMapping("/admin/stats")
	public ResponseEntity<SupportStatsDto> getStats() {

	    return ResponseEntity.ok(
	            supportService.getSupportStats()
	    );
	}
	
	  @GetMapping("/ticket/{ticketId}")
	    public ResponseEntity<SupportTicket> getTicket(@PathVariable Long ticketId) {
	        return ResponseEntity.ok(supportService.getTicketById(ticketId));
	    }
}
