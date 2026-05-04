package com.nextbuy.demo.dto;

import java.time.LocalDateTime;

public class SystemNotificationResponse {
    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;

    public SystemNotificationResponse(Long id, String title, String message, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
    }

    // getters only (or add setters if needed)
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}