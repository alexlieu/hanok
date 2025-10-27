package com.alex_lieu.hanok.payment;

import com.alex_lieu.hanok.dto.payment.PaymentGatewayResponse;

import java.math.BigDecimal;
import java.time.YearMonth;

public interface PaymentGatewayClient {
    PaymentGatewayResponse processCardPayment(
            String cardNo,
            String cvv,
            YearMonth expiration,
            BigDecimal total,
            String currency
    );

    PaymentGatewayResponse processTokenPayment(
            String token,
            BigDecimal total,
            String currency
    );

}
