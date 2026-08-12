package com.medique.exception;

public class QueueTokenNotFoundException extends RuntimeException {
    public QueueTokenNotFoundException(String message) {
        super(message);
    }
}
