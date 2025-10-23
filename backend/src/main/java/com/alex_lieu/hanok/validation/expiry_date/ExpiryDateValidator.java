package com.alex_lieu.hanok.validation.expiry_date;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ExpiryDateValidator implements ConstraintValidator<ValidExpiryDate, String> {
    @Override
    public void initialize(ValidExpiryDate constraintAnnotation) {
    }

    @Override
    public boolean isValid(String input, ConstraintValidatorContext context) {
        if (input == null || input.isEmpty()) {
            return true;
        }
        context.disableDefaultConstraintViolation();
        try {
            YearMonth expiryYearMonth = YearMonth.parse(input, DateTimeFormatter.ofPattern("MM/uu"));
            YearMonth now = YearMonth.now();
            if (expiryYearMonth.isBefore(now)) {
                context.buildConstraintViolationWithTemplate("Expiry date has already passed")
                        .addPropertyNode("expiration").addConstraintViolation();
                return false;
            }
        } catch (DateTimeParseException e) {
            context.buildConstraintViolationWithTemplate("Expiry date should be formatted as MM/YY")
                    .addPropertyNode("expiration")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
