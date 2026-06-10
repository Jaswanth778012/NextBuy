package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SupportTicketReply;

public interface SupportTicketReplyRepository extends JpaRepository<SupportTicketReply, Long> {
	
	List<SupportTicketReply> findBySupportTicketIdOrderByCreatedAtAsc(Long supportTicketId);

}
