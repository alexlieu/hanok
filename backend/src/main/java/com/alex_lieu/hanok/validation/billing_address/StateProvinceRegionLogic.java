package com.alex_lieu.hanok.validation.billing_address;

import com.alex_lieu.hanok.dto.validation.ValidationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Set;

public class StateProvinceRegionLogic {
    private static final Logger logger = LoggerFactory.getLogger(StateProvinceRegionLogic.class);

    public static final LinkedHashMap<String, String> US_STATES = new LinkedHashMap<String, String>() {
        {
            put("AL", "Alabama");
            put("AK", "Alaska");
            put("AZ", "Arizona");
            put("AR", "Arkansas");
            put("CA", "California");
            put("CO", "Colorado");
            put("CT", "Connecticut");
            put("DE", "Delaware");
            put("FL", "Florida");
            put("GA", "Georgia");
            put("HI", "Hawaii");
            put("ID", "Idaho");
            put("IL", "Illinois");
            put("IN", "Indiana");
            put("IA", "Iowa");
            put("KS", "Kansas");
            put("KY", "Kentucky");
            put("LA", "Louisiana");
            put("ME", "Maine");
            put("MD", "Maryland");
            put("MA", "Massachusetts");
            put("MI", "Michigan");
            put("MN", "Minnesota");
            put("MS", "Mississippi");
            put("MO", "Missouri");
            put("MT", "Montana");
            put("NE", "Nebraska");
            put("NV", "Nevada");
            put("NH", "New Hampshire");
            put("NJ", "New Jersey");
            put("NM", "New Mexico");
            put("NY", "New York");
            put("NC", "North Carolina");
            put("ND", "North Dakota");
            put("OH", "Ohio");
            put("OK", "Oklahoma");
            put("OR", "Oregon");
            put("PA", "Pennsylvania");
            put("RI", "Rhode Island");
            put("SC", "South Carolina");
            put("SD", "South Dakota");
            put("TN", "Tennessee");
            put("TX", "Texas");
            put("UT", "Utah");
            put("VT", "Vermont");
            put("VA", "Virginia");
            put("WA", "Washington");
            put("WV", "West Virginia");
            put("WI", "Wisconsin");
            put("WY", "Wyoming");
            put("DC", "District of Columbia");
        }
    };
    public static final LinkedHashMap<String, String> CA_PROVINCES = new LinkedHashMap<String, String>() {
        {
            put("AB", "Alberta");
            put("BC", "British Columbia");
            put("MB", "Manitoba");
            put("NB", "New Brunswick");
            put("NL", "Newfoundland and Labrador");
            put("NS", "Nova Scotia");
            put("ON", "Ontario");
            put("PE", "Prince Edward Island");
            put("QC", "Quebec");
            put("SK", "Saskatchewan");
            put("NT", "Northwest Territories");
            put("NU", "Nunavut");
            put("YT", "Yukon");
        }
    };
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
            "Jeju"));

    public static ValidationResult validate(String country, String stateProvinceRegion) {
        if (!StringUtils.hasText(country)) {
            return ValidationResult.success();
        }
        logger.info("Validating State/Province/Region");
        switch (country.toUpperCase()) {
            case "US":
                logger.info("Country is US");
                if (!StringUtils.hasText(stateProvinceRegion)) {
                    logger.info("State is required for US");
                    return ValidationResult.failure("State is required for the US");
                }
                if (!US_STATES.containsKey(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid US state");
                }
                break;
            case "CA":
                if (!StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("Province is required for CA");
                }
                if (!CA_PROVINCES.containsKey(stateProvinceRegion.toUpperCase())) {
                    return ValidationResult.failure(stateProvinceRegion + " is not a valid CA province");
                }
                break;
            case "KR":
                if (!StringUtils.hasText(stateProvinceRegion)) {
                    return ValidationResult.failure("Province is required for KR");
                }
                if (!KR_PROVINCES.contains(stateProvinceRegion)) {
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
