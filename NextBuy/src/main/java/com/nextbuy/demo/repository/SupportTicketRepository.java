package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SupportTicket;
import com.nextbuy.demo.enums.TicketStatus;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
	
	// All tickets of a user
    List<SupportTicket> findByUserId(Long userId);

    // Filter by status
    List<SupportTicket> findByStatus(TicketStatus status);

    // Admin dashboard count
    long countByStatus(TicketStatus status);
    
}
