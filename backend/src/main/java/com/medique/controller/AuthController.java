package com.medique.controller;

import com.medique.dto.request.LoginRequest;
import com.medique.dto.response.AuthenticationResponse;
import com.medique.dto.response.CurrentUserResponse;
import com.medique.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
            Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication));
    }
}
