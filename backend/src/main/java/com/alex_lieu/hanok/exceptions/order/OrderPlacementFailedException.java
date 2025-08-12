package com.alex_lieu.hanok.exceptions.order;

import lombok.Getter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class OrderPlacementFailedException extends Exception implements Serializable {
    private static final long serialVersionUID = 1L;

    private final LocalDateTime timestamp;
    private final int orderId;
    private final String customerId;
    private final String error;
    private final String reasonCode;
    private final BigDecimal attemptedAmount;
    private final String currency;

    public OrderPlacementFailedException(int orderId, String customerId, String error, String reasonCode, BigDecimal attemptedAmount, String currency, Throwable cause) {
        super("Order placement failed for Order ID: " + orderId +
                        ", Customer: " + customerId +
                        " - Message: " + error +
                        " - Reason Code: " + reasonCode +
                        " - Amount: " + attemptedAmount + " " + currency,
                cause);
        this.timestamp = LocalDateTime.now();
        this.orderId = orderId;
        this.customerId = customerId;
        this.error = error;
        this.reasonCode = reasonCode;
        this.attemptedAmount = attemptedAmount;
        this.currency = currency;
    }

    public OrderPlacementFailedException(int orderId, String error, String reasonCode, BigDecimal attemptedAmount, String currency, Throwable cause) {
        this(orderId, null, error, reasonCode, attemptedAmount, currency, cause);
    }

}
