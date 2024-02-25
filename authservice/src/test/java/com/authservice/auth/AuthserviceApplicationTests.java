package com.authservice.auth;

import org.junit.jupiter.api.Test;
import com.authservice.auth.controller.AuthController;
import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import java.time.LocalDateTime;

class AuthserviceApplicationTests {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }


    
    @Test
    void testStrongPassword() {
        String strongPassword = "Strong@Password123";
        assertTrue(authController.isPasswordStrong(strongPassword));
    }

    @Test
    void testWeakPassword() {
        String weakPassword = "weak";
        assertFalse(authController.isPasswordStrong(weakPassword));
    }

    @Test
    void testRegisterUserWithWeakPassword() {
        // Arrange
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("weak");

        // Act
        boolean result = authController.registerUser(user).getStatusCode().is2xxSuccessful();

        // Assert
        assertFalse(result);
    }

    @Test
    void testAccountLockoutAfterThreeFailedLoginAttempts() {
        // Arrange
        User user = new User("testUser", "password");
        user.setFailedLoginAttempts(2); // Set failed login attempts to 2
        user.setLockoutTime(LocalDateTime.now().minusMinutes(31)); // Lockout time more than 30 minutes ago

        // Mock repository method calls
        when(userRepository.findByUsername("testUser")).thenReturn(user);
        when(passwordEncoder.matches("password", "password")).thenReturn(false);

        // Act
        ResponseEntity<?> response = authController.authenticateUser(new User("testUser", "password"));

        // Assert
        assertEquals(401, response.getStatusCodeValue()); // Check if response is 401 Unauthorized
        assertEquals(3, user.getFailedLoginAttempts()); // Check if failed login attempts increased
        assertEquals(true, user.isLocked()); // Check if the account is locked
    }
}