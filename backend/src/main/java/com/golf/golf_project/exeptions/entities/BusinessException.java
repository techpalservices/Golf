package com.golf.golf_project.exeptions.entities;

// 409 — business rule violation (duplicate, invalid state, etc.)
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
