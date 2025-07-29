package com.alex_lieu.hanok.payment;

import com.alex_lieu.hanok.dto.payment.PaymentGatewayResponse;

import java.math.BigDecimal;

public interface PaymentGatewayClient {
    PaymentGatewayResponse processCardPayment(
            String cardNo,
            String cvv,
            String expiryMonth,
            String expiryYear,
            BigDecimal total,
            String currency
    );

    PaymentGatewayResponse processTokenPayment(
            String token,
            BigDecimal total,
            String currency
    );

}
