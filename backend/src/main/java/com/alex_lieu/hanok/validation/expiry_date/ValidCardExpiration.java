package com.alex_lieu.hanok.validation.expiry_date;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CardExpirationValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCardExpiration {
    String message() default "{card.expiry.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
