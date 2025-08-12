package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PickupDateValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPickupDate {
    String message() default "Pickup date must be after {earliestPickupDate} and before {latestPickupDate} inclusive. Our cutoff time is {cutoffTime} in {timezone}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
