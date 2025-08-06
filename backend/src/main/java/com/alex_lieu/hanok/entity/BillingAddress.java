package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.CountryCode;
import com.alex_lieu.hanok.validation.MinIfPresent;
import com.alex_lieu.hanok.validation.billing_address.ValidStateProvinceRegion;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
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
@ValidStateProvinceRegion(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
public class BillingAddress {
    @NotBlank(message = "{billing.address-line-1.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 3, max = 100, message = "{billing.address-line-1.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_line1")
    private String addressLine1;

    @MinIfPresent(min = 5, message = "{billing.addressLine2.minIfPresent}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(max = 100, message = "{billing.addressLine2.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_line2")
    private String addressLine2;

    //    @NotBlank(message = "{billing.city.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 2, max = 100, message = "{billing.city.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_city")
    private String city;

    @Column(name = "billing_address_stateProvinceRegion")
    private String stateProvinceRegion;

    @MinIfPresent(min = 3, message = "{billing.county.minIfPresent}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(max = 100, message = "{billing.county.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_county")
    private String county;

    @NotBlank(message = "{billing.postal-code.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 3, max = 12, message = "{billing.postal-code.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_postalCode")
    private String postalCode;

    @NotBlank(message = "{billing.country.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 2, max = 2, message = "{billing.country.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @CountryCode(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Column(name = "billing_address_country")
    private String countryCode;
}
