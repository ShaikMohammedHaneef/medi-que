package com.medique.service;

import com.medique.dto.request.LoginRequest;
import com.medique.dto.response.AuthenticationResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    public AuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            ));
            return AuthenticationResponse.builder()
                    .token("Authentication Successfull")
                    .build();

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("invalid Email or Password");
        } catch (Exception e) {
            throw e;
        }
    }
}
