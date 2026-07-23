package com.medique.controller;

import com.medique.dto.request.LoginRequest;
import com.medique.dto.response.AuthenticationResponse;
import com.medique.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
