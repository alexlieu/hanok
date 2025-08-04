package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegion;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
@EqualsAndHashCode
@ValidStateProvinceRegion
public class BillingAddress {
    @NotBlank(message = "{billing.address-line-1.not-blank}")
    @Size(min = 3, max = 100, message = "{billing.address-line-1.size}")
    @Column(name = "billing_address_line1")
    private String addressLine1;

    @MinIfPresent(min = 5, message = "{billing.addressLine2.minIfPresent}")
    @Size(max = 100, message = "{billing.addressLine2.size}")
    @Column(name = "billing_address_line2")
    private String addressLine2;

    @NotBlank(message = "{billing.city.not-blank}")
    @Size(min = 2, max = 100, message = "{billing.city.size}")
    @Column(name = "billing_address_city")
    private String city;

    @Column(name = "billing_address_stateProvinceRegion")
    private String stateProvinceRegion;

    @MinIfPresent(min = 3, message = "{billing.county.minIfPresent}")
    @Size(max = 100, message = "{billing.county.size}")
    @Column(name = "billing_address_county")
    private String county;

    @NotBlank(message = "{billing.postal-code.not-blank}")
    @Size(min = 3, max = 12, message = "{billing.postal-code.size}")
    @Column(name = "billing_address_postalCode")
    private String postalCode;

    @NotBlank(message = "{billing.country.not-blank}")
    @Size(min = 2, max = 2, message = "{billing.country.size}")
    @CountryCode
    @Column(name = "billing_address_country")
    private String countryCode;
}
