package com.medique.exception;

public class ReceptionistAlreadyExistsException extends RuntimeException {
    public ReceptionistAlreadyExistsException(String message) {
        super(message);
    }
}
