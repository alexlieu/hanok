package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ContactNumberValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ContactNumberConstraint {
    String message() default "{contact.number.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String countryCode() default "GB";
}
