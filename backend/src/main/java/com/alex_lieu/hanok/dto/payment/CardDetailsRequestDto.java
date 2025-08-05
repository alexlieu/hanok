package com.alex_lieu.hanok.dto.payment;

import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record CardDetailsRequestDto(

        @NotBlank(message = "{card.number.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 19, max = 19, message = "{card.number.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        @Pattern(regexp = "^(\\d{4}\\s){3}\\d{4}$", message = "{card.request.number.digits}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String cardNo,

        @NotBlank(message = "{card.holder-name.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 2, max = 100, message = "{card.holder-name.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{card.holder-name.pattern}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String cardholderName,

        @NotBlank(message = "{card.expiry.year.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Pattern(regexp = "^(0[1-9]|1[0-2])/([0-9]{2})$", message = "{card.request.expiry.format}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String expiryDate,

        @NotBlank(message = "{card.cvv.not-blank}", groups = {Payment.CardPayment.class, FirstValidationGroup.class})
        @Size(min = 3, max = 4, message = "{card.cvv.size}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        @Pattern(regexp = "^[0-9]+$", message = "{card.cvv.digits}", groups = {Payment.CardPayment.class, SecondValidationGroup.class})
        String cvv,

        @Valid
        @NotNull(message = "{card.address.not-null}", groups = {Payment.CardPayment.class})
        BillingAddressDto billingAddress

) implements Serializable {
}
