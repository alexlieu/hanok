package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegionDto;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@ValidStateProvinceRegionDto(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
public record BillingAddressDto(
        @NotBlank(message = "{billing.address-line-1.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Size(min = 3, max = 100, message = "{billing.address-line-1.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String addressLine1,

        @MinIfPresent(min = 5, message = "{billing.address-line-2.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.address-line-2.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String addressLine2,

        @Size(min = 2, max = 100, message = "{billing.state-province-region.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        String stateProvinceRegion,

        @MinIfPresent(min = 3, message = "{billing.county.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.county.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String county,

//        @NotBlank(message = "{billing.city.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @MinIfPresent(min = 3, message = "{billing.city.min-if-present}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(max = 100, message = "{billing.city.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String city,

        @NotBlank(message = "{billing.postal-code.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 3, max = 12, message = "{billing.postal-code.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String postalCode,

        @NotBlank(message = "{billing.country.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 2, max = 2, message = "{billing.country.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @CountryCode(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String countryCode

) implements Serializable {
}
