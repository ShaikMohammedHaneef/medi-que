package com.medique.exception;

public class QueueTokenCannotBeCancelledException extends RuntimeException {
    public QueueTokenCannotBeCancelledException(String message) {
        super(message);
    }
}
