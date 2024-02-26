package com.authservice.auth.controller;

import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;



@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Constructor to inject dependencies
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("User already exists - please log in");
        }

        // Check if the password meets the strength criteria
        if (!isPasswordStrong(user.getPassword())) {
            return ResponseEntity.badRequest().body("Password does not meet the criteria");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody User user) {
    User existingUser = userRepository.findByUsername(user.getUsername());

    if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
        // Reset failed login attempts count on successful login
        existingUser.setFailedLoginAttempts(0);
        userRepository.save(existingUser);
        return ResponseEntity.ok("User authenticated");
    } else {
        // Increment failed login attempts count
        if (existingUser != null) {
            existingUser.setFailedLoginAttempts(existingUser.getFailedLoginAttempts() + 1);
            userRepository.save(existingUser);

            // Check if the user's account should be locked
            if (existingUser.getFailedLoginAttempts() >= 3) {
                // Account locked due to too many failed attempts
                lockAccount(existingUser);
                return ResponseEntity.status(401).body("Your account has been permanently locked due to multiple failed login attempts.");
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

    // Method to lock the user account permanently
    public void lockAccount(User user) {
        user.setAccountNonLocked(false);
        userRepository.save(user);
    }

    // Method to check if the password meets the strength criteria
    public boolean isPasswordStrong(String password) {
        boolean digit = false;
        boolean upperCase = false;
        boolean lowerCase = false;
        boolean specialChar = false;

        // Check password length
        if (password.length() < 8) {
            return false;
        }

        // Iterate through each character in the password
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                digit = true;
            } else if (Character.isUpperCase(c)) {
                upperCase = true;
            } else if (Character.isLowerCase(c)) {
                lowerCase = true;
            } else {
                specialChar = true;
            }
        }

        // Check if all criteria are met
        return digit && upperCase && lowerCase && specialChar;
    }
}