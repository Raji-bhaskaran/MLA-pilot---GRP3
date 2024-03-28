package com.authservice.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.time.LocalDateTime;
import com.authservice.auth.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.authservice.auth.controller.AuthController;
import com.authservice.auth.repository.UserRepository;

@SpringBootTest
class AuthserviceApplicationTests {

    

    @Test
    public void testHandleFailedLogin_AccountNotLocked() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController authController = new AuthController(userRepository, passwordEncoder);
        
        // Create a LocalDateTime representing the time of the last failed attempt
        LocalDateTime lastFailedAttempt = LocalDateTime.now();
            // Create a test user with failed login attempts less than the threshold
        User testUser = new User("test", "testpassword", 2, false, lastFailedAttempt);
        
        // Call the handleFailedLogin method
        authController.handleFailedLogin(testUser);

        // Verify that failed login attempts are incremented
        assertEquals(3, testUser.getFailedLoginAttempts());
        assertTrue(testUser.isAccountLocked());
        assertNotNull(testUser.getLockoutTimestamp());
    }

    @Test
    public void testAuthenticateUser_AccountLocked() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController authController = new AuthController(userRepository, passwordEncoder);
        // Arrange
        User lockedUser = new User("lockedUser", "password", 3, true, LocalDateTime.now());
        when(userRepository.findByUsername("lockedUser")).thenReturn(lockedUser);
        
        // Act
        ResponseEntity<?> response = authController.authenticateUser(new User("lockedUser", "password", 0, false, null));
        
        // Assert
        assertEquals(403, response.getStatusCodeValue());
        assertEquals("Account is locked. Please try again later.", response.getBody());
    }

    @Test
    public void testAuthenticateUser_UserNotFound() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController authController = new AuthController(userRepository, passwordEncoder);
        // Arrange
        when(userRepository.findByUsername("nonExistingUser")).thenReturn(null);
        
        // Act
        ResponseEntity<?> response = authController.authenticateUser(new User("nonExistingUser", "password", 0, false, null));
        
        // Assert
        assertEquals(401, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }

   


    @Test
    public void testStrongPassword() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController controller = new AuthController(userRepository, passwordEncoder);

        assertTrue(controller.isPasswordStrong("StrongPassword123@"));
    }

    @Test
    public void testWeakPassword_TooShort() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController controller = new AuthController(userRepository, passwordEncoder);

        assertFalse(controller.isPasswordStrong("weak")); // Too short
    }

    @Test
    public void testWeakPassword_NoUppercase() {
        // Mock dependencies
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // Create an instance of AuthController with mock dependencies
        AuthController controller = new AuthController(userRepository, passwordEncoder);

        assertFalse(controller.isPasswordStrong("onlylowercase")); // No uppercase
    }

    
}
