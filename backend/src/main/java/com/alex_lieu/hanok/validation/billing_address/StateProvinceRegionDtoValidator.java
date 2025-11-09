package com.alex_lieu.hanok.validation.billing_address;

import com.alex_lieu.hanok.dto.payment.BillingAddressDto;
import com.alex_lieu.hanok.dto.validation.ValidationResult;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StateProvinceRegionDtoValidator implements ConstraintValidator<ValidStateProvinceRegionDto, BillingAddressDto> {
    @Override
    public void initialize(ValidStateProvinceRegionDto constraintAnnotation) {
    }

    @Override
    public boolean isValid(BillingAddressDto address, ConstraintValidatorContext context) {
        if (address == null) {
            return true;
        }
        ValidationResult result = StateProvinceRegionLogic.validate(address.country(), address.stateProvinceRegion());
        if (! result.isValid()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(result.getMessage()).addPropertyNode("stateProvinceRegion")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
