package com.clinical.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.clinical.model.LoginRequest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testSuccessfulLogin() {
        LoginRequest loginRequest = new LoginRequest("doctor", "password", "doctor");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            "/api/auth/login", 
            loginRequest, 
            String.class
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("success"));
    }

    @Test
    void testFailedLoginWithEmptyCredentials() {
        LoginRequest loginRequest = new LoginRequest("", "", "doctor");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            "/api/auth/login", 
            loginRequest, 
            String.class
        );
        
        // Should return bad request for empty credentials
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}