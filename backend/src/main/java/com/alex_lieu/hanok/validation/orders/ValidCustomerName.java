package com.alex_lieu.hanok.validation.orders;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CustomerNameValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCustomerName {
    enum NameForType {
        CARD("card"),
        FULL_NAME("fullName");
        private final String value;

        NameForType(String value) {
            this.value = value;
        }

        public String value() {
            return value;
        }
    }

    NameForType nameFor() default NameForType.FULL_NAME;

    String message() default "Name is invalid or is required.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
