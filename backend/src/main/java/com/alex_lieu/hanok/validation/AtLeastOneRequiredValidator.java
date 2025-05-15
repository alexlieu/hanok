package com.alex_lieu.hanok.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class AtLeastOneRequiredValidator implements ConstraintValidator<AtLeastOneRequired, Object> {
    private String[] fieldNames;
    private String messageTemplate;

    @Override
    public void initialize(AtLeastOneRequired constraintAnnotation) {
        this.fieldNames = constraintAnnotation.fields();
        this.messageTemplate = constraintAnnotation.message();
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
            String errorMessage = messageTemplate.replace("{fields}", String.join(" or ", fieldNames));
            context.buildConstraintViolationWithTemplate(errorMessage)
                    .addPropertyNode(fieldNames[0])
                    .addConstraintViolation();
            return false;
        }

//        if (objectToValidate == null) {
//            return true;
//        }
//
//        BeanWrapper beanWrapper = new BeanWrapperImpl(objectToValidate);
//
//        for (String fieldName : fieldNames) {
//            Object fieldValue = beanWrapper.getPropertyValue(fieldName);
//            if (fieldValue != null) {
//                if (fieldValue instanceof String stringValue) {
//                    if (! stringValue.trim().isEmpty()) {
//                        return true;
//                    }
//                } else {
//                    return true;
//                }
//            }
//        }
//        context.disableDefaultConstraintViolation();
//        context.buildConstraintViolationWithTemplate(messageTemplate).addConstraintViolation();
//        System.out.println(messageTemplate);
//        return false;

    }

}
