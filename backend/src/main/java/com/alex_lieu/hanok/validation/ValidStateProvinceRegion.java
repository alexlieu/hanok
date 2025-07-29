package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StateProvinceRegionValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidStateProvinceRegion {
    String message() default "{stateProvinceRegion.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
