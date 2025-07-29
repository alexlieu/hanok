package com.alex_lieu.hanok.dto.payment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record CardDetailsRequestDto(

        @NotBlank(message = "card.number.notBlank")
        @Size(min = 16, max = 16, message = "card.number.size")
        @Pattern(regexp = "^(\\d{4}\\s){3}\\d{4}$", message = "card.request.number.digits")
        String cardNo,

        @NotBlank(message = "card.holderName.notBlank")
        @Size(min = 2, max = 100, message = "card.holderName.size")
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "card.holderName.pattern")
        String cardholderName,

        @NotBlank(message = "card.expiry.year.notBlank")
        @Pattern(regexp = "^(0[1-9]|1[0-2])/([0-9]{2})$", message = "card.request.expiry.format")
        String expiryDate,

        @NotBlank(message = "card.cvv.notBlank")
        @Size(min = 3, max = 4, message = "card.cvv.size")
        @Pattern(regexp = "^[0-9]+$", message = "card.cvv.digits")
        String cvv,

        @Valid
        @NotNull(message = "card.address.notNull")
        BillingAddressDto billingAddress

) implements Serializable {
}
