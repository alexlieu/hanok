package com.alex_lieu.hanok.exceptions.order;

import com.alex_lieu.hanok.enums.PaymentMethod;
import lombok.Getter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class PaymentFailedException extends Exception implements Serializable {
    private static final long serialVersionUID = 1L;

    private final LocalDateTime timestamp;
    private final String gatewayMessage;
    private final String gatewayErrorCode;
    private final String orderId;
    private final BigDecimal attemptedAmount;
    private final String currency;
    private final PaymentMethod paymentMethod;

    public PaymentFailedException(String gatewayMessage, String gatewayErrorCode, String orderId, BigDecimal attemptedAmount, String currency, PaymentMethod paymentMethod, Throwable cause) {
        super("Payment failed for Order ID: " + orderId +
                        " - Message: " + gatewayMessage +
                        " (Code: " + gatewayErrorCode + ")" +
                        " - Amount: " + attemptedAmount + " " + currency +
                        " - Method: " + paymentMethod.getDisplayName(),
                cause);
        this.timestamp = LocalDateTime.now();
        this.gatewayMessage = gatewayMessage;
        this.gatewayErrorCode = gatewayErrorCode;
        this.orderId = orderId;
        this.attemptedAmount = attemptedAmount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
    }

    public PaymentFailedException(
            String gatewayMessage,
            String gatewayErrorCode,
            String orderId,
            BigDecimal attemptedAmount,
            String currency,
            PaymentMethod paymentMethod) {
        this(gatewayMessage, gatewayErrorCode, orderId, attemptedAmount, currency, paymentMethod, null);
    }

}
