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

    
    public String sendOtp(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

       
        otpRepo.deleteByEmail(email);

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setEmail(email);
        resetOtp.setOtp(otp);
        resetOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepo.save(resetOtp);
        
        String emailBody = "NEXTBUY: PASSWORD RESET\n" +
                "==========================\n\n" +
                "Hi there,\n\n" +
                "We received a request to reset your password. " +
                "Please use the verification code below:\n\n" +
                "OTP CODE: " + otp + "\n\n" +
                "This code is valid for 5 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The NextBuy Team\n" +
                "Bengaluru, India";

        emailService.sendEmail(email, "NextBuy Password Reset: "+ otp, emailBody);

        return "OTP sent successfully";
    }
    
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