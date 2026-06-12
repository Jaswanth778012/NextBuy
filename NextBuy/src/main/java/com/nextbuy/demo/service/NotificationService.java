package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.Notification;
import com.nextbuy.demo.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
public class NotificationService {
	
	private NotificationRepository notificationRepository;
	
	public NotificationService(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
	}
	
	public Notification createNotification(
            String type,
            String title,
            String message,
            Long referenceId,
            String referenceType,
            String priority) {

        Notification notification = Notification.builder()
                .type(type)
                .title(title)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .priority(priority)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                .orElseThrow();

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }
    
    public void markAllAsRead() {

        List<Notification> unreadNotifications =
                notificationRepository.findByIsReadFalse();

        unreadNotifications.forEach(notification ->
                notification.setIsRead(true));

        notificationRepository.saveAll(unreadNotifications);
    }
}
