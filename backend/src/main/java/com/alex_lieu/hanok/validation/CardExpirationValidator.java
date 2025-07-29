package com.alex_lieu.hanok.validation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CardExpirationConstraint.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface CardExpirationValidator {
    String message() default "{card.expiry.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
