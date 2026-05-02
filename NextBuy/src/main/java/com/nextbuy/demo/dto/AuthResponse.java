package com.nextbuy.demo.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String role
) {
}
