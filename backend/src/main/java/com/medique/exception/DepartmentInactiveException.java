package com.medique.exception;

public class DepartmentInactiveException extends RuntimeException {
    public DepartmentInactiveException(String message) {
        super(message);
    }
}
