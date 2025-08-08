package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneNumberValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhoneNumber {
    String message() default "The provided phone number is not valid for {country}. Please check the number and try again.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
