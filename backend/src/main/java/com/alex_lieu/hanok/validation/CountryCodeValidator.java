package com.alex_lieu.hanok.validation;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import io.micrometer.common.util.StringUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CountryCodeValidator implements ConstraintValidator<CountryCode, String> {
    private final PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();

    @Override
    public boolean isValid(String countryCode, ConstraintValidatorContext context) {
        if (! StringUtils.isEmpty(countryCode)) {
            return true;
        }
        return phoneNumberUtil.getSupportedRegions().contains(countryCode);
    }
}
