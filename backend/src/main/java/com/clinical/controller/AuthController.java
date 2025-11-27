package com.clinical.controller;

import com.clinical.model.LoginRequest;
import com.clinical.model.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // Simple authentication - Remove @Valid annotation for now
        if (isValidCredentials(loginRequest)) {
            LoginResponse response = new LoginResponse(
                true, 
                "Login successful", 
                loginRequest.getUserType(),
                "mock-token-" + System.currentTimeMillis()
            );
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(
                false, 
                "Invalid credentials", 
                null, 
                null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    private boolean isValidCredentials(LoginRequest loginRequest) {
        // Simple validation
        return loginRequest.getUsername() != null && 
               !loginRequest.getUsername().isEmpty() && 
               loginRequest.getPassword() != null && 
               !loginRequest.getPassword().isEmpty();
    }
}