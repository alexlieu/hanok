package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PaymentDetailsValidator.class)
@Target({ElementType.TYPE}) // <--- Applies to the Payment class
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPaymentDetails {
    String message() default "{payment.cardDetails.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
