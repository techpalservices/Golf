package com.golf.golf_project.exeptions.entities;

// 422 — validation failed at business level (not bean validation)
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}