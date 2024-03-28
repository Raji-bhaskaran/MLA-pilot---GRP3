package com.authservice.auth.controller;

import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import java.time.Duration; // Import Duration class
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Constructor injection
    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    

    // Lockout duration in minutes
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    // Lockout threshold
    private static final int LOCKOUT_THRESHOLD_ATTEMPTS = 3;

    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginUser) {
        User existingUser = userRepository.findByUsername(loginUser.getUsername());
    
        if (existingUser == null) {
            return ResponseEntity.status(401).body("User not found");
        } else if (existingUser.isAccountLocked()) {
            if (isLockoutExpired(existingUser)) {
                // Reset account and allow login attempt
                resetAccount(existingUser);
                existingUser = userRepository.save(existingUser); // Save the changes
            } else {
                // Account is still locked
                return ResponseEntity.status(403).body("Account is locked. Please try again later.");
            }
        }
    
        if (passwordEncoder.matches(loginUser.getPassword(), existingUser.getPassword())) {
            existingUser.resetFailedLoginAttempts(); // Reset failed login attempts
            userRepository.save(existingUser);
            return ResponseEntity.ok("User authenticated");
        } else {
            handleFailedLogin(existingUser);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    public void handleFailedLogin(User user) {
        // Increment failed login attempts only if the current value is less than the threshold
        user.incrementFailedLoginAttempts();
        if (user.getFailedLoginAttempts() >= LOCKOUT_THRESHOLD_ATTEMPTS) {
            lockAccount(user);
        }
        userRepository.save(user);
    }

    private void lockAccount(User user) {
        user.setAccountLocked(true);
        user.setLockoutTimestamp(LocalDateTime.now());
    }

    private void resetAccount(User user) {
        user.resetFailedLoginAttempts();
        user.setAccountLocked(false);
        user.setLockoutTimestamp(null);
    }

    private boolean isLockoutExpired(User user) {
        LocalDateTime lockoutTimestamp = user.getLockoutTimestamp();
        if (lockoutTimestamp == null) {
            return true; // Account is not locked
        }
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(lockoutTimestamp, now);
        return duration.toMinutes() >= LOCKOUT_DURATION_MINUTES;
    }
    
      
     

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("User already exists - please log in");
        }

        // Check password strength
        if (!isPasswordStrong(user.getPassword())) {
            return ResponseEntity.badRequest().body("Password is not strong enough");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

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
