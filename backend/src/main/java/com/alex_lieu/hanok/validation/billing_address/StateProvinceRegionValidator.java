package com.alex_lieu.hanok.validation.billing_address;

import com.alex_lieu.hanok.dto.validation.ValidationResult;
import com.alex_lieu.hanok.entity.BillingAddress;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StateProvinceRegionValidator implements ConstraintValidator<ValidStateProvinceRegion, BillingAddress> {
    @Override
    public void initialize(ValidStateProvinceRegion constraintAnnotation) {
    }

    @Override
    public boolean isValid(BillingAddress address, ConstraintValidatorContext context) {
        if (address == null) {
            return true;
        }
        ValidationResult result = StateProvinceRegionLogic.validate(address.getCountryCode(), address.getStateProvinceRegion());
        if (! result.isValid()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(result.getMessage()).addConstraintViolation();
            return false;
        }
        return true;
    }
}
