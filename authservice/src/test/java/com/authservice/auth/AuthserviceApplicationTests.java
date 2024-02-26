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
import static org.mockito.Mockito.mock;
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
    void testPermanentAccountLockoutAfterThreeFailedLoginAttempts() {
        // Arrange
        User user = new User("testUser", "password");
        user.setFailedLoginAttempts(2); // Set failed login attempts to 2

        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findByUsername("testUser")).thenReturn(user);

        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.matches("password", "password")).thenReturn(false);

        AuthController authController = new AuthController(userRepository, passwordEncoder);

        // Act
        ResponseEntity<?> response = authController.authenticateUser(new User("testUser", "password"));

        // Assert
        assertEquals(401, response.getStatusCodeValue()); // Check if response is 401 Unauthorized
        assertEquals(3, user.getFailedLoginAttempts()); // Check if failed login attempts increased
        assertEquals(false, user.isAccountNonLocked()); // Check if the account is permanently locked
    }
}