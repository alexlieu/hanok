package com.alex_lieu.hanok.validation.payment;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CardNumberValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCardNumber {
    String message() default "{card.number.valid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
