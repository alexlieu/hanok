package com.alex_lieu.hanok.validation.expiry_date;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.YearMonth;

public class ExpiryDateValidator implements ConstraintValidator<ValidExpiryDate, YearMonth> {
    @Override
    public void initialize(ValidExpiryDate constraintAnnotation) {
    }

    @Override
    public boolean isValid(YearMonth input, ConstraintValidatorContext context) {
        if (input == null) {
            return true;
        }
        return ! input.isBefore(YearMonth.now());
    }
}
