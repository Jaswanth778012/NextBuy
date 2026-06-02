package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.ScheduledEmail;
import com.nextbuy.demo.repository.ScheduledEmailRepository;

@Service
public class ScheduledEmailProcessor {

    private final ScheduledEmailRepository repository;
    private final JavaMailSender mailSender;

    public ScheduledEmailProcessor(
            ScheduledEmailRepository repository,
            JavaMailSender mailSender) {

        this.repository = repository;
        this.mailSender = mailSender;
    }

    @Scheduled(fixedRate = 60000)
    public void processScheduledEmails() {

        List<ScheduledEmail> emails =
                repository.findBySentFalseAndScheduledTimeBefore(
                        LocalDateTime.now());

        for (ScheduledEmail email : emails) {

            String[] recipients =
                    email.getRecipientEmails().split(",");

            for (String recipient : recipients) {

                SimpleMailMessage message =
                        new SimpleMailMessage();

                message.setTo(recipient);
                message.setSubject(email.getSubject());
                message.setText(email.getBody());

                mailSender.send(message);
            }

            email.setSent(true);

            repository.save(email);
        }
    }
}