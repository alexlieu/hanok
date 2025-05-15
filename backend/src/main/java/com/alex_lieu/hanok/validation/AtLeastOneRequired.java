package com.alex_lieu.hanok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AtLeastOneRequiredValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface AtLeastOneRequired {

    /**
     * @return The names of the fields to check. At least one of these must have a value.
     */
    String[] fields();

    /**
     * @return The error message template.
     */
    String message() default "{fields.atleastone.required}";

    /**
     * @return The validation groups.
     */
    Class<?>[] groups() default {};

    /**
     * @return The payload type.
     */
    Class<? extends Payload>[] payload() default {};
}


