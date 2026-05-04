package com.nextbuy.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class BroadcastNotificationRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String message;

    // getters & setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}