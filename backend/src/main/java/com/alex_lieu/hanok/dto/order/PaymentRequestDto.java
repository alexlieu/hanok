package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.dto.payment.CardDetailsRequestDto;
import com.alex_lieu.hanok.enums.PaymentMethod;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import com.alex_lieu.hanok.validation.payment.ValidPaymentDetailsDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

@ValidPaymentDetailsDto(groups = {ValidationGroups.PaymentChecks.class, ValidationGroups.FormatAndLogicChecks.class})
public record PaymentRequestDto(
        @NotNull(message = "{payment.total.not-null}", groups = {ValidationGroups.PaymentChecks.class})
        @PositiveOrZero(message = "{payment.total.positive}", groups = {ValidationGroups.PaymentChecks.class})
        BigDecimal total,

        @NotNull(message = "{payment.method.not-null}", groups = {ValidationGroups.PaymentChecks.class})
        PaymentMethod paymentMethod,

        @Size(min = 10, max = 200, message = "{payment.token.size}", groups = {ValidationGroups.TokenChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String paymentToken,

        @Valid
        CardDetailsRequestDto cardDetails

) implements Serializable {
}
