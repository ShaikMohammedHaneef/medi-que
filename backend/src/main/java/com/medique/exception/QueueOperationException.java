package com.medique.exception;

public class QueueOperationException extends RuntimeException {
    public QueueOperationException(String message) {
        super(message);
    }
}
