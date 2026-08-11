package com.medique.exception;

public class ActiveBookingExistsException extends RuntimeException {
    public ActiveBookingExistsException(String message) {
        super(message);
    }
}
