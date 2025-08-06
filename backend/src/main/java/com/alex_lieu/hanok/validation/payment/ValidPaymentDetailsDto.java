package com.alex_lieu.hanok.validation.payment;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PaymentDetailsDtoValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPaymentDetailsDto {
    String message() default "{payment.card-details.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
