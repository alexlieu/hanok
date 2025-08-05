package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.dto.payment.CardDetailsRequestDto;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

public record PaymentRequestDto(
        @NotNull(message = "{payment.total.notNull}")
        @PositiveOrZero(message = "{payment.total.positive}")
        BigDecimal total,

        @NotNull(message = "{payment.method.notNull}")
        PaymentMethod paymentMethod,

        @Size(min = 10, max = 200, message = "{payment.token.size}", groups = {Payment.TokenizedPayment.class})
        String paymentToken,

        @Valid
        CardDetailsRequestDto cardDetails

) implements Serializable {
}
