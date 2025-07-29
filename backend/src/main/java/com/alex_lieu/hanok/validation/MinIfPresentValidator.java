package com.alex_lieu.hanok.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class MinIfPresentValidator implements ConstraintValidator<MinIfPresent, String> {
    private int minLength;

    @Override
    public void initialize(MinIfPresent constraintAnnotation) {
        this.minLength = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (! StringUtils.hasText(value)) {
            return true;
        }

        return value.length() >= minLength;
    }
}
