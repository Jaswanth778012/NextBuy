package com.nextbuy.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.ScheduledEmail;

public interface ScheduledEmailRepository extends JpaRepository<ScheduledEmail, Long> {
	
	List<ScheduledEmail> findBySentFalseAndScheduledTimeBefore(
            LocalDateTime time);

}
