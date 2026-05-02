package com.nextbuy.demo.component;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Component
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void createAdmin() {

        if (!userRepository.existsByUsername("admin")) {

            User admin = new User();

            admin.setUsername("admin");
            admin.setPassword(
                passwordEncoder.encode("Admin@123")
            );
            
            admin.setName("System Admin");
            admin.setEmail("admin@gmail.com");
            admin.setMobileNumber(9876543210L);
            admin.setAddressLine1("Banglore");
            admin.setDob(null);
            admin.setGender(null);
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("Admin created successfully");
        }
    }
}
