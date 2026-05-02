package com.nextbuy.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.AuthResponse;
import com.nextbuy.demo.dto.UserLoginRequestDTO;
import com.nextbuy.demo.dto.UserRegisterRequestDto;
import com.nextbuy.demo.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestPart("user") @Valid UserRegisterRequestDto request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        String message = authService.register(request, image);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", message));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}