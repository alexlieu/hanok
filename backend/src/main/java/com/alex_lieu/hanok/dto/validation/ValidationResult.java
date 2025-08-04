package com.alex_lieu.hanok.dto.validation;

import lombok.Getter;

@Getter
public class ValidationResult {
    private final boolean isValid;
    private final String message;

    public ValidationResult(boolean success, String message) {
        this.isValid = success;
        this.message = message;
    }

    public static ValidationResult success() {
        return new ValidationResult(true, null);
    }

    public static ValidationResult failure(String message) {
        return new ValidationResult(false, message);
    }

    public boolean isValid() {
        return isValid;
    }

}
