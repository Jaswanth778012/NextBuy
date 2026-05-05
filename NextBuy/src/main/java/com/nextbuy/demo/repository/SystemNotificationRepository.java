package com.nextbuy.demo.repository;

import com.nextbuy.demo.entity.SystemNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemNotificationRepository extends JpaRepository<SystemNotification, Long> {
}