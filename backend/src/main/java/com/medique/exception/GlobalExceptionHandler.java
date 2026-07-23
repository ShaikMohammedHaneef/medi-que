package com.medique.exception;

import com.medique.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DepartmentAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentAlreadyExists(DepartmentAlreadyExistsException e, HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        HttpStatus.CONFLICT.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );
    }

    @ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentNotFound(DepartmentNotFoundException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        HttpStatus.NOT_FOUND.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );
    }

    @ExceptionHandler(DoctorAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleDoctorAlreadyExists(DoctorAlreadyExistsException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        HttpStatus.CONFLICT.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );

    }

    @ExceptionHandler(DepartmentInactiveException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentInactive(DepartmentInactiveException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        HttpStatus.CONFLICT.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );

    }

    @ExceptionHandler(DoctorNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDoctorNotFound(DoctorNotFoundException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        HttpStatus.NOT_FOUND.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );
    }

    @ExceptionHandler(ReceptionistNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleReceptionistNotFound(ReceptionistNotFoundException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        HttpStatus.NOT_FOUND.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );

    }

    @ExceptionHandler(ReceptionistAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleReceptionistAlreadyExists(ReceptionistAlreadyExistsException e, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        HttpStatus.CONFLICT.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                        e.getMessage(),
                        request.getRequestURI())
                );
    }
}
