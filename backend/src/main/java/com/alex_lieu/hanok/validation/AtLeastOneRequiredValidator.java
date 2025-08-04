package com.alex_lieu.hanok.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class AtLeastOneRequiredValidator implements ConstraintValidator<AtLeastOneRequired, Object> {
    private static final Logger logger = LoggerFactory.getLogger(AtLeastOneRequiredValidator.class);

    private String[] fieldNames;

    @Override
    public void initialize(AtLeastOneRequired constraintAnnotation) {
        this.fieldNames = constraintAnnotation.fields();
    }

    @Override
    public boolean isValid(Object objectToValidate, ConstraintValidatorContext context) {
        if (objectToValidate == null) {
            return true;
        }

        BeanWrapper beanWrapper = new BeanWrapperImpl(objectToValidate);
        boolean atLeastOneFieldHasValue = false;

        for (String fieldName : fieldNames) {
            Object fieldValue = beanWrapper.getPropertyValue(fieldName);
            if (fieldValue != null) {
                if (fieldValue instanceof String) {
                    if (! ((String) fieldValue).trim().isEmpty()) {
                        atLeastOneFieldHasValue = true;
                        break;
                    }
                } else {
                    atLeastOneFieldHasValue = true;
                    break;
                }
            }
        }

        if (atLeastOneFieldHasValue) {
            return true;
        } else {
            context.disableDefaultConstraintViolation();
            String messageTemplate = context.getDefaultConstraintMessageTemplate();
            String errorMessage = messageTemplate.replace("{fields}", String.join(", ", fieldNames));
            context.buildConstraintViolationWithTemplate(errorMessage)
                    .addPropertyNode(fieldNames[0])
                    .addConstraintViolation();
            return false;
        }

    }

}
