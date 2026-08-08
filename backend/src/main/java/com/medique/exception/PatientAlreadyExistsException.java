package com.medique.exception;

public class PatientAlreadyExistsException extends RuntimeException {
    public PatientAlreadyExistsException(String message) {
        super(message);
    }
}
