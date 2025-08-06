package com.alex_lieu.hanok.validation.expiry_date;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ExpiryDateValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidExpiryDate {
    String message() default "Card expiry date has already passed or is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
