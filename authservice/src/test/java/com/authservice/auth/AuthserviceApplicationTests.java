package com.authservice.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.authservice.auth.controller.AuthController;
import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.when;

class AuthserviceApplicationTests {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

@Test
void testRegisterUserWithStrongPassword() {
    // Arrange
    User user = new User();
    user.setUsername("testUser");
    user.setPassword("StrongPassword123#");

    // Mocking the userRepository
    UserRepository userRepository = Mockito.mock(UserRepository.class);
    Mockito.when(userRepository.existsByUsername(Mockito.anyString())).thenReturn(false);

    // Mocking the passwordEncoder
    PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
    Mockito.when(passwordEncoder.encode(Mockito.anyString())).thenReturn("encodedPassword");

    // Instantiate the authController with mocked dependencies using constructor injection
    AuthController authController = new AuthController(userRepository, passwordEncoder);

    // Act
    ResponseEntity<?> response = authController.registerUser(user);

    // Assert
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("User registered successfully!", response.getBody());
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

    
}





/* ===================
@SpringBootTest
class AuthserviceApplicationTests {

	@Test
	void contextLoads() {
	}

}*/
