package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegionDto;
import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@ValidStateProvinceRegionDto
public record BillingAddressDto(
        @NotBlank(message = "{billing.address-line-1.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 3, max = 100, message = "{billing.address-line-1.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String addressLine1,

        @MinIfPresent(min = 5, message = "{billing.address-line-2.min-if-present}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(max = 100, message = "{billing.address-line-2.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String addressLine2,

        @Size(min = 2, max = 100, message = "{billing.state-province-region.size}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        String stateProvinceRegion,

        @MinIfPresent(min = 3, message = "{billing.county.min-if-present}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(max = 100, message = "{billing.county.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String county,

        @NotBlank(message = "{billing.city.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @MinIfPresent(min = 3, message = "{billing.city.min-if-present}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        @Size(max = 100, message = "{billing.city.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String city,

        @NotBlank(message = "{billing.postal-code.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 3, max = 12, message = "{billing.postal-code.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String postalCode,

        @NotBlank(message = "{billing.country.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 2, max = 2, message = "{billing.country.size}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @CountryCode
        String countryCode

) implements Serializable {
}
