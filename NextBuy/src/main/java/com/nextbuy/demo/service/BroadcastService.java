package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.BroadcastEmailRequest;
import com.nextbuy.demo.dto.BroadcastNotificationRequest;
import com.nextbuy.demo.dto.ScheduleEmailRequest;
import com.nextbuy.demo.dto.SelectedUsersEmailRequest;
import com.nextbuy.demo.dto.SentEmailResponse;
import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.entity.ScheduledEmail;
import com.nextbuy.demo.entity.SentEmail;
import com.nextbuy.demo.entity.SystemNotification;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.ScheduledEmailRepository;
import com.nextbuy.demo.repository.SentEmailRepository;
import com.nextbuy.demo.repository.SystemNotificationRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class BroadcastService {

    private final SystemNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final ScheduledEmailRepository scheduledEmailRepository;
    private final SentEmailRepository sentEmailRepository;

    public BroadcastService(SystemNotificationRepository notificationRepository,
                            UserRepository userRepository,
                            JavaMailSender mailSender, ScheduledEmailRepository scheduledEmailRepository, SentEmailRepository sentEmailRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.scheduledEmailRepository = scheduledEmailRepository;
        this.sentEmailRepository = sentEmailRepository;
    }

    // 1. Save the notification – all users will see it later
    @Transactional
    public void sendNotificationToAll(BroadcastNotificationRequest request) {
        SystemNotification notification = new SystemNotification(request.getTitle(), request.getMessage());
        notificationRepository.save(notification);
    }

    // 2. Send email to every registered user
    @Transactional
    public void sendEmailToAll(BroadcastEmailRequest request) {

        List<User> allUsers = userRepository.findAll();

        String recipients = allUsers.stream()
                .map(User::getEmail)
                .collect(Collectors.joining(","));

        for (User user : allUsers) {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(user.getEmail());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());

            mailSender.send(message);
        }

        SentEmail sentEmail = new SentEmail(
        		recipients,
                request.getSubject(),
                request.getBody(),
                "BROADCAST",
                LocalDateTime.now()
        );

        sentEmailRepository.save(sentEmail);
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
    
    // Send Email to selected users
    @Transactional
    public void sendEmailToSelectedUsers(SelectedUsersEmailRequest request) {

        List<User> users = userRepository.findAllById(request.getUserIds());

        String recipients = users.stream()
                .map(User::getEmail)
                .collect(Collectors.joining(","));

        for (User user : users) {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(user.getEmail());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());

            mailSender.send(message);
        }

        SentEmail sentEmail = new SentEmail(
                recipients,
                request.getSubject(),
                request.getBody(),
                "SELECTED_USERS",
                LocalDateTime.now()
        );

        sentEmailRepository.save(sentEmail);
    }
    
    // Schedule Email to selected users
    @Transactional
    public void scheduleEmail(ScheduleEmailRequest request) {

        List<User> users = userRepository.findAllById(request.getUserIds());

        String emails = users.stream()
                .map(User::getEmail)
                .collect(Collectors.joining(","));

        ScheduledEmail email = new ScheduledEmail();

        email.setSubject(request.getSubject());
        email.setBody(request.getBody());
        email.setScheduledTime(request.getScheduledTime());
        email.setRecipientEmails(emails);

        scheduledEmailRepository.save(email);

        // Save history
        SentEmail sentEmail = new SentEmail(
                emails,
                request.getSubject(),
                request.getBody(),
                "SCHEDULED",
                LocalDateTime.now()
        );

        sentEmailRepository.save(sentEmail);
    }
    
    public List<SentEmailResponse> getAllSentEmails() {

        return sentEmailRepository.findAll()
                .stream()
                .map(email -> new SentEmailResponse(
                        email.getId(),
                        email.getRecipients(),
                        email.getSubject(),
                        email.getBody(),
                        email.getType(),
                        email.getSentAt()
                ))
                .collect(Collectors.toList());
    }
}