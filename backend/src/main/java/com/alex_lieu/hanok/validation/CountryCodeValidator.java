package com.alex_lieu.hanok.validation;

import io.micrometer.common.util.StringUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Locale;
import java.util.Set;

public class CountryCodeValidator implements ConstraintValidator<CountryCode, String> {

    public void initialize(CountryCode constraintAnnotation) {
    }

    @Override
    public boolean isValid(String countryCode, ConstraintValidatorContext context) {
        if (StringUtils.isEmpty(countryCode)) {
            return true;
        }
        Set<String> isoCountries = Set.of(Locale.getISOCountries());
        return isoCountries.contains(countryCode);
    }
}
