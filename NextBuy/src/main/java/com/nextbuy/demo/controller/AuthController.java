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
import com.nextbuy.demo.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService service;

    public AuthController(AuthService authService, PasswordResetService service) {
        this.authService = authService;
        this.service = service;
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
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(service.sendOtp(req.get("email")));
    }

    // STEP 2
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                service.verifyOtp(req.get("email"), req.get("otp"))
        );
    }

    // STEP 3
    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                service.resetPassword(
                        req.get("email"),
                        req.get("newPassword"),
                        req.get("confirmPassword")
                )
        );
    }
}