package com.medique.exception;

public class ReceptionistNotFoundException extends RuntimeException {
    public ReceptionistNotFoundException(String message) {
        super(message);
    }
}
