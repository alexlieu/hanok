package com.alex_lieu.hanok.payment;

import com.alex_lieu.hanok.dto.payment.PaymentGatewayResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.UUID;

@Service
@Profile({"dev", "test"})
public class MockPaymentGatewayClient implements PaymentGatewayClient {

    @Override
    public PaymentGatewayResponse processCardPayment(
            String cardNo,
            String cvv,
            YearMonth expiration,
            BigDecimal total,
            String currency
    ) {
        String lastFour = "0000";
        if (cardNo != null && cardNo.length() >= 4) {
            lastFour = cardNo.substring(cardNo.length() - 4);
        }
        String token = "mock_tok_card_" + UUID.randomUUID().toString();
        String transactionId = "mock_txn_card_" + UUID.randomUUID().toString();
        if (cardNo != null) {
            if (cardNo.startsWith("4000")) {
                return new PaymentGatewayResponse(true, token, lastFour, "Mock: Card payment approved (card type success)", transactionId, total, currency, null);
            } else if (cardNo.startsWith("4242")) {
                return new PaymentGatewayResponse(false, token, lastFour, "Mock: Card declined - insufficient funds (simulated failure)", transactionId, total, currency, "INSUFFICIENT_FUNDS");
            }
        }
        return new PaymentGatewayResponse(true, token, lastFour, "Mock: Card payment approved (generic success)", transactionId, total, currency, null);
    }

    @Override
    public PaymentGatewayResponse processTokenPayment(
            String token,
            BigDecimal total,
            String currency
    ) {
        if (token == null || token.isBlank()) {
            return new PaymentGatewayResponse(false, null, null, "Mock: Payment token is missing", null, total, currency, "TOKEN_PROCESSED_FAILED");
        }

        String gatewayToken = "mock_tok_card_" + token.substring(0, Math.min(token.length(), 10)) + UUID.randomUUID()
                .toString();
        String transactionId = "mock_txn_card_" + UUID.randomUUID().toString();
        return new PaymentGatewayResponse(true, gatewayToken, null, "Mock: Token payment approved", transactionId, total, currency, null);
    }


}
