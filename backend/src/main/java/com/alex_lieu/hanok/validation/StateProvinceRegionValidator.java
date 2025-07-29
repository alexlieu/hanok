package com.alex_lieu.hanok.validation;

import com.alex_lieu.hanok.entity.BillingAddress;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class StateProvinceRegionValidator implements ConstraintValidator<ValidStateProvinceRegion, BillingAddress> {

    private static final Set<String> US_STATES = new HashSet<>(Arrays.asList(
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
            "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
            "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
    ));
    private static final Set<String> CA_PROVINCES = new HashSet<>(Arrays.asList(
            "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"
    ));

    @Override
    public boolean isValid(BillingAddress address, ConstraintValidatorContext context) {
        if (address == null) {
            return true;
        }

        String country = address.getCountryCode();
        String stateProvinceRegion = address.getStateProvinceRegion();

        if (! StringUtils.hasText(stateProvinceRegion)) {
            return true;
        }

        switch (country.toUpperCase()) {
            case "US", "CA":
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    addConstraintViolation(context, "State/Province is required for " + country, stateProvinceRegion);
                    return false;
                }
                if (country.equalsIgnoreCase("US") && ! US_STATES.contains(stateProvinceRegion)) {
                    addConstraintViolation(context, stateProvinceRegion + " is not a valid US state", stateProvinceRegion);
                    return false;
                }
                if (country.equalsIgnoreCase("CA") && ! CA_PROVINCES.contains(stateProvinceRegion)) {
                    addConstraintViolation(context, stateProvinceRegion + " is not a valid CA province", stateProvinceRegion);
                    return false;
                }
                break;
            case "GB", "KR":
                if (StringUtils.hasText(stateProvinceRegion)) {
                    addConstraintViolation(context, "State/Province/Region should not be provided for " + country, stateProvinceRegion);
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message, String fieldName) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addPropertyNode(fieldName).addConstraintViolation();
    }
}
