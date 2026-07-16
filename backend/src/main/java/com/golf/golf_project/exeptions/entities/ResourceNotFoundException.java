package com.golf.golf_project.exeptions.entities;

// 404 — resource not found
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

