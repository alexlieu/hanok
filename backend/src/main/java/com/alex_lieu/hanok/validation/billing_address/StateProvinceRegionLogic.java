package com.alex_lieu.hanok.validation.billing_address;

import com.alex_lieu.hanok.dto.validation.ValidationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class StateProvinceRegionLogic {
    private static final Logger logger = LoggerFactory.getLogger(StateProvinceRegionLogic.class);

    private static final Set<String> US_STATES = new HashSet<>(Arrays.asList(
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
            "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
            "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
    ));
    private static final Set<String> CA_PROVINCES = new HashSet<>(Arrays.asList(
            "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"
    ));

    public static ValidationResult validate(String country, String stateProvinceRegion) {
        if (! StringUtils.hasText(country)) {
            return ValidationResult.success();
        }
        switch (country.toUpperCase()) {
            case "US":
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("State is required for the US");
                }
                if (! US_STATES.contains(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid US state");
                }
            case "CA":
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("Province is required for CA");
                }
                if (! CA_PROVINCES.contains(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid CA province");
                }
                break;
            case "GB", "KR":
                if (StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("State/Province/Region should not be provided for " + country);
                }
                break;
            default:
                return ValidationResult.success();
        }
        return ValidationResult.success();
    }

    ;

}
