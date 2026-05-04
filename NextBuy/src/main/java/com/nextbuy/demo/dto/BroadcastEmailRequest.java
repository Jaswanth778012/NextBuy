package com.nextbuy.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class BroadcastEmailRequest {
    @NotBlank
    private String subject;
    @NotBlank
    private String body;   // can be plain text or HTML

    // getters & setters
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}