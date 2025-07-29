package com.alex_lieu.hanok.dto.payment;

import java.io.Serializable;
import java.math.BigDecimal;

public record PaymentGatewayResponse(
        boolean success,
        String token,
        String lastFourDigits,
        String message,
        String transactionId,
        BigDecimal total,
        String currency,
        String errorCode
) implements Serializable {
}
