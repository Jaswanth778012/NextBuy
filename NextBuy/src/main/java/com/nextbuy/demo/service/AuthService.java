package com.nextbuy.demo.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.AuthResponse;
import com.nextbuy.demo.dto.UserLoginRequestDTO;
import com.nextbuy.demo.dto.UserRegisterRequestDto;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService customUserDetailsService,
                       JwtService jwtService,
                       CloudinaryService cloudinaryService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
    }

    public String register(UserRegisterRequestDto request, MultipartFile image) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadFile(image);
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobileNumber(request.getMobileNumber());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setRole(Role.USER);
        user.setAddressLine1(request.getAddress());
        user.setDob(request.getDob());

        user.setDpUrl(imageUrl);

        userRepository.save(user);

        return "User registered successfully";
    }
    
    public AuthResponse login(UserLoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return new AuthResponse(token, "Bearer", userDetails.getUsername(), user.getRole().name());
    }
}
