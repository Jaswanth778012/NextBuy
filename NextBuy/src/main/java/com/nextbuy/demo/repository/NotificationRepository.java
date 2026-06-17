package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	long countByIsReadFalse();
	List<Notification> findByIsReadFalse();

}
