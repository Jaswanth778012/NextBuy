package com.nextbuy.demo.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.entity.PasswordResetOtp;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.PasswordResetOtpRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
@Transactional
public class PasswordResetService {

    private final PasswordResetOtpRepository otpRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; 

    public PasswordResetService(PasswordResetOtpRepository otpRepo,
                                UserRepository userRepo,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // STEP 1: Send OTP
    public String sendOtp(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ DELETE OLD OTP FIRST
        otpRepo.deleteByEmail(email);

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setEmail(email);
        resetOtp.setOtp(otp);
        resetOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepo.save(resetOtp);

        emailService.sendEmail(email, "Your OTP", "OTP: " + otp);

        return "OTP sent successfully";
    }
    // STEP 2: Verify OTP
    public String verifyOtp(String email, String otp) {
        PasswordResetOtp resetOtp = otpRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!resetOtp.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        return "OTP verified";
    }

    // STEP 3: Reset Password
    public String resetPassword(String email, String newPassword, String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        otpRepo.deleteByEmail(email); // clean up

        return "Password reset successful";
    }
}