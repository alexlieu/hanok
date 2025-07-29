package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record BillingAddressDto(
        @NotBlank(message = "billing.addressLine1.notBlank")
        @Size(min = 3, max = 100, message = "billing.addressLine1.size")
        String addressLine1,

        @MinIfPresent(min = 5, message = "billing.addressLine2.minIfPresent")
        @Size(max = 100, message = "billing.addressLine2.size")
        String addressLine2,

        @NotBlank(message = "billing.city.notBlank")
        @Size(min = 2, max = 100, message = "billing.city.size")
        String stateProvinceRegion,

        @MinIfPresent(min = 3, message = "billing.county.minIfPresent")
        @Size(max = 100, message = "billing.county.size")
        String county,

        @MinIfPresent(min = 3, message = "billing.county.minIfPresent")
        @Size(max = 100, message = "billing.county.size")
        String city,

        @Size(min = 3, max = 12, message = "billing.postalCode.size")
        String postalCode,

        @NotBlank(message = "billing.country.notBlank")
        @Size(min = 2, max = 2, message = "billing.country.size")
        @CountryCode
        String countryCode

) implements Serializable {
}
