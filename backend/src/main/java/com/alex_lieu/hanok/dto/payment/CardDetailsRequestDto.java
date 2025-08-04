package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import jakarta.validation.GroupSequence;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@GroupSequence({CardDetailsRequestDto.class, FirstValidationGroup.class, SecondValidationGroup.class})
public record CardDetailsRequestDto(

        @NotBlank(message = "{card.number.notBlank}", groups = {FirstValidationGroup.class})
        @Size(min = 19, max = 19, message = "{card.number.size}", groups = {SecondValidationGroup.class})
        @Pattern(regexp = "^(\\d{4}\\s){3}\\d{4}$", message = "{card.request.number.digits}", groups = {SecondValidationGroup.class})
        String cardNo,

        @NotBlank(message = "{card.holderName.notBlank}", groups = {FirstValidationGroup.class})
        @Size(min = 2, max = 100, message = "{card.holderName.size}", groups = {SecondValidationGroup.class})
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{card.holderName.pattern}", groups = {SecondValidationGroup.class})
        String cardholderName,

        @NotBlank(message = "{card.expiry.year.notBlank}")
        @Pattern(regexp = "^(0[1-9]|1[0-2])/([0-9]{2})$", message = "{card.request.expiry.format}")
        String expiryDate,

        @NotBlank(message = "{card.cvv.notBlank}")
        @Size(min = 3, max = 4, message = "{card.cvv.size}")
        @Pattern(regexp = "^[0-9]+$", message = "{card.cvv.digits}")
        String cvv,

        @Valid
        @NotNull(message = "{card.address.notNull}")
        BillingAddressDto billingAddress

) implements Serializable {
}
