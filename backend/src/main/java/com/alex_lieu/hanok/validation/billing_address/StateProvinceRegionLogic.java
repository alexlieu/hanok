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

    public static final Set<String> US_STATES = new HashSet<>(Arrays.asList(
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
            "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
            "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
    ));
    public static final Set<String> CA_PROVINCES = new HashSet<>(Arrays.asList(
            "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"
    ));
    public static final Set<String> KR_PROVINCES = new HashSet<>(Arrays.asList(
            // Special City
            "Seoul",
            // Metropolitan Cities
            "Busan",
            "Daegu",
            "Incheon",
            "Gwangju City",
            "Daejeon",
            "Ulsan",
            // Special Self-Governing City
            "Sejong",
            // Provinces
            "Gyeonggi",
            "Gangwon",
            "North Chungcheong",
            "South Chungcheong",
            "North Jeolla",
            "South Jeolla",
            "North Gyeongsang",
            "South Gyeongsang",
            "Jeju"
    ));

    public static ValidationResult validate(String country, String stateProvinceRegion) {
        if (! StringUtils.hasText(country)) {
            return ValidationResult.success();
        }
        logger.info("Validating State/Province/Region");
        switch (country.toUpperCase()) {
            case "US":
                logger.info("Country is US");
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    logger.info("State is required for US");
                    return ValidationResult.failure("State is required for the US");
                }
                if (! US_STATES.contains(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid US state");
                }
                break;
            case "CA":
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("Province is required for CA");
                }
                if (! CA_PROVINCES.contains(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid CA province");
                }
                break;
            case "KR":
                if (! StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("Province is required for KR");
                }
                if (! KR_PROVINCES.contains(stateProvinceRegion)) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid KR province");
                }
                break;
            case "GB":
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
