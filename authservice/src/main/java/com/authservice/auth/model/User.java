package com.authservice.auth.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private int failedLoginAttempts; // New field
    private LocalDateTime lastFailedLogin; // New field
    private LocalDateTime lockoutTime; // Define lockoutTime variable here

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.failedLoginAttempts = 0;
    }

    // Getters and setters for failedLoginAttempts and lastFailedLogin

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public LocalDateTime getLastFailedLogin() {
        return lastFailedLogin;
    }

    public void setLastFailedLogin(LocalDateTime lastFailedLogin) {
        this.lastFailedLogin = lastFailedLogin;
    }

       
    public boolean isLocked() {
        if (lastFailedLogin== null) {
            // If there are no failed login attempts, account is not locked
            return false;
        }
        
        // Calculate the lockout time by adding 30 minutes to the last failed login time
        LocalDateTime lockoutTime = lastFailedLogin.plusMinutes(30);
        
        // Check if the current time is after the lockout time
        return LocalDateTime.now().isBefore(lockoutTime);
    }
    

    public LocalDateTime getLockoutTime() {
        return lockoutTime;
    }

    public void setLockoutTime(LocalDateTime lockoutTime) {
        this.lockoutTime = lockoutTime;
    }

}
