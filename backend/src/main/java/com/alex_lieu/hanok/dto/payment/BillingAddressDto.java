package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegionDto;
import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@ValidStateProvinceRegionDto
@GroupSequence({BillingAddressDto.class, FirstValidationGroup.class, SecondValidationGroup.class})
public record BillingAddressDto(
        @NotBlank(message = "{billing.address-line-1.not-blank}", groups = {FirstValidationGroup.class})
        @Size(min = 3, max = 100, message = "{billing.address-line-1.size}", groups = {SecondValidationGroup.class})
        String addressLine1,

        @MinIfPresent(min = 5, message = "{billing.address-line-2.min-if-present}", groups = {FirstValidationGroup.class})
        @Size(max = 100, message = "{billing.address-line-2.size}", groups = {SecondValidationGroup.class})
        String addressLine2,

        @Size(min = 2, max = 100, message = "{billing.state-province-region.size}", groups = {FirstValidationGroup.class})
        String stateProvinceRegion,

        @MinIfPresent(min = 3, message = "{billing.county.min-if-present}", groups = {FirstValidationGroup.class})
        @Size(max = 100, message = "{billing.county.size}", groups = {SecondValidationGroup.class})
        String county,

        @NotBlank(message = "{billing.city.not-blank}", groups = {FirstValidationGroup.class})
        @MinIfPresent(min = 3, message = "{billing.city.min-if-present}", groups = {SecondValidationGroup.class})
        @Size(max = 100, message = "{billing.city.size}", groups = {SecondValidationGroup.class})
        String city,

        @NotBlank(message = "{billing.postal-code.not-blank}", groups = {FirstValidationGroup.class})
        @Size(min = 3, max = 12, message = "{billing.postal-code.size}", groups = {SecondValidationGroup.class})
        String postalCode,

        @NotBlank(message = "{billing.country.not-blank}", groups = {FirstValidationGroup.class})
        @Size(min = 2, max = 2, message = "{billing.country.size}", groups = {FirstValidationGroup.class})
        @CountryCode
        String countryCode

) implements Serializable {
}
