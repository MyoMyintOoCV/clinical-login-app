package com.clinical.model;

public class LoginResponse {
    private boolean success;
    private String message;
    private String userType;
    private String token;

    public LoginResponse(boolean success, String message, String userType, String token) {
        this.success = success;
        this.message = message;
        this.userType = userType;
        this.token = token;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}