package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegionDto;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.Optional;

@ValidStateProvinceRegionDto(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
public record BillingAddressDto(
        @NotBlank(message = "{billing.address-line-1.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Size(min = 3, max = 100, message = "{billing.address-line-1.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.address-line-1.pattern")
        String addressLine1,

        @MinIfPresent(min = 5, message = "{billing.address-line-2.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.address-line-2.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.address-line-2.pattern")
        String addressLine2,

        @Size(min = 2, max = 100, message = "{billing.state-province-region.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.state-province-region.pattern")
        String stateProvinceRegion,

        @MinIfPresent(min = 3, message = "{billing.county.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.county.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.county.pattern")
        String county,

//        @NotBlank(message = "{billing.city.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @MinIfPresent(min = 3, message = "{billing.city.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.city.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.city.pattern")
        String city,

        @NotBlank(message = "{billing.postal-code.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 3, max = 12, message = "{billing.postal-code.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.postal-code.pattern")
        String postalCode,

        @NotBlank(message = "{billing.country.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 2, max = 2, message = "{billing.country.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "billing.country.pattern")
        @CountryCode(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String country

) implements Serializable {
    private String normaliseString(String input) {
        return Optional.ofNullable(input).map(s -> s.trim().replaceAll("\\s+", " ")).orElse(null);
    }

    private String normaliseCodeString(String input) {
        return Optional.ofNullable(input).map(String::trim).map(String::toUpperCase).orElse(null);
    }

    public BillingAddressDto(String addressLine1, String addressLine2, String stateProvinceRegion, String county, String city, String postalCode, String country) {
        this.addressLine1 = normaliseString(addressLine1);
        this.addressLine2 = normaliseString(addressLine2);
        this.stateProvinceRegion = normaliseString(stateProvinceRegion);
        this.county = normaliseString(county);
        this.city = normaliseString(city);
        this.postalCode = normaliseCodeString(postalCode);
        this.country = normaliseCodeString(country);
    }
}
