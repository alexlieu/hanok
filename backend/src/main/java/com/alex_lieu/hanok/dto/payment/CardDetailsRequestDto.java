package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.expiry_date.ValidExpiryDate;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record CardDetailsRequestDto(

        @NotBlank(message = "{card.number.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Pattern(regexp = "^(\\d{4}\\s){3}\\d{4}$", message = "{card.request.number.digits}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Size(min = 19, max = 19, message = "{card.number.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String cardNumber,

        @NotBlank(message = "{card.holder-name.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 2, max = 100, message = "{card.holder-name.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[^\\p{Cntrl}0-9]+$", message = "{card.holder-name.pattern}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String holderName,

        @NotBlank(message = "{card.request.expiry.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @ValidExpiryDate(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String expiration,

        @NotBlank(message = "{card.cvv.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 3, max = 4, message = "{card.cvv.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^[0-9]+$", message = "{card.cvv.digits}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String cvv,

        @Valid @NotNull(message = "{card.address.not-null}", groups = {ValidationGroups.CardChecks.class})
        BillingAddressDto billingAddress

) implements Serializable {
}
