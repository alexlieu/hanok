package com.alex_lieu.hanok.validation.billing_address;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StateProvinceRegionValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidStateProvinceRegion {
    String message() default "{state-province-region.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
