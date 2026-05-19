package com.nextbuy.demo.service;

import com.nextbuy.demo.dto.BroadcastEmailRequest;
import com.nextbuy.demo.dto.BroadcastNotificationRequest;
import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.entity.SystemNotification;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.SystemNotificationRepository;
import com.nextbuy.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BroadcastService {

    private final SystemNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public BroadcastService(SystemNotificationRepository notificationRepository,
                            UserRepository userRepository,
                            JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    // 1. Save the notification – all users will see it later
    @Transactional
    public void sendNotificationToAll(BroadcastNotificationRequest request) {
        SystemNotification notification = new SystemNotification(request.getTitle(), request.getMessage());
        notificationRepository.save(notification);
    }

    // 2. Send email to every registered user
    @Transactional(readOnly = true)
    public void sendEmailToAll(BroadcastEmailRequest request) {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());
            mailSender.send(message);
        }
    }

    // 3. Return all system notifications (for authenticated users)
    public List<SystemNotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(n -> new SystemNotificationResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getCreatedAt()))
                .collect(Collectors.toList());
    }
}