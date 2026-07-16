package com.golf.golf_project.exeptions.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
        boolean success,
        String message,
        ErrorDetail error,
        LocalDateTime timestamp
) {
    public record ErrorDetail(String code, Object details) {}

    public static ErrorResponse of(String message, String code) {
        return new ErrorResponse(false, message, new ErrorDetail(code, null), LocalDateTime.now());
    }

    public static ErrorResponse of(String message, String code, Object details) {
        return new ErrorResponse(false, message, new ErrorDetail(code, details), LocalDateTime.now());
    }
}
