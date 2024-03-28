package com.authservice.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    @Field("username")
    private String username;
    @Field("password")
    private String password;
    @Field("lockoutTimestamp")
    private LocalDateTime lockoutTimestamp; // New field for lockout timestamp
    @Field("isAccountLock")
    private boolean isAccountLock; // New field for account lock
    @Field("failedLoginAttempts")
    private int failedLoginAttempts;

    public User() {
    }

    // Constructor
    public User(String username, String password, int failedLoginAttempts, boolean isAccountLock, LocalDateTime lockoutTimestamp) {
        this.username = username;
        this.password = password;
        this.failedLoginAttempts = failedLoginAttempts;
        this.isAccountLock = isAccountLock;
        this.lockoutTimestamp = lockoutTimestamp;
    }

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

    public LocalDateTime getLockoutTimestamp() {
        return lockoutTimestamp;
    }

    public void setLockoutTimestamp(LocalDateTime lockoutTimestamp) {
        this.lockoutTimestamp = lockoutTimestamp;
    }

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public boolean isAccountLocked() {
        return isAccountLock;
    }

    public void setAccountLocked(boolean accountLock) {
        isAccountLock = accountLock;
    }

    // Method to increment failed login attempts and check for lockout
    public void incrementFailedLoginAttempts() {
        failedLoginAttempts++;
    }

    // Method to reset failed login attempts and unlock account
    public void resetFailedLoginAttempts() {
        failedLoginAttempts = 0;
        isAccountLock = false;
        lockoutTimestamp = null;
    }
}

