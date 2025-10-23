package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.order.PaymentRequestDto;
import com.alex_lieu.hanok.dto.payment.BillingAddressDto;
import com.alex_lieu.hanok.dto.payment.CardDetailsRequestDto;
import com.alex_lieu.hanok.dto.payment.PaymentGatewayResponse;
import com.alex_lieu.hanok.entity.BillingAddress;
import com.alex_lieu.hanok.entity.CardDetails;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.entity.TokenizedPaymentDetails;
import com.alex_lieu.hanok.enums.PaymentMethod;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.payment.MockPaymentGatewayClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final MockPaymentGatewayClient paymentGatewayClient;

    public PaymentService(MockPaymentGatewayClient paymentGatewayClient) {
        this.paymentGatewayClient = paymentGatewayClient;
    }


    public BillingAddress convertToBillingAddress(BillingAddressDto dto) {
        if (dto == null) {
            return null;
        }
        return BillingAddress.builder()
                .addressLine1(dto.addressLine1())
                .addressLine2(dto.addressLine2())
                .county(dto.county())
                .city(dto.city())
                .postalCode(dto.postalCode())
                .countryCode(dto.country())
                .stateProvinceRegion(dto.stateProvinceRegion())
                .build();
    }

    public Payment processPaymentForOrder(PaymentRequestDto dto, BigDecimal finalTotal) throws PaymentFailedException {
        PaymentGatewayResponse gatewayResponse;
        CardDetails persistableCardDetails = null;
        TokenizedPaymentDetails persistableTokenizedPaymentDetails = null;
        if (dto.paymentMethod().equals(PaymentMethod.CARD)) {
            YearMonth expiryMonthYear;
            CardDetailsRequestDto cardDetailsRequestDto = dto.cardDetails();
            try {
                expiryMonthYear = YearMonth.parse(cardDetailsRequestDto.expiration(), DateTimeFormatter.ofPattern("MM/uu"));
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid expiry date format");
            }
            String expiryMonth = String.format("%02d", expiryMonthYear.getMonthValue());
            String expiryYear = String.valueOf(expiryMonthYear.getYear());
            gatewayResponse = paymentGatewayClient.processCardPayment(
                    cardDetailsRequestDto.cardNumber().replace(" ", ""),
                    cardDetailsRequestDto.cvv(),
                    expiryMonth,
                    expiryYear,
                    finalTotal,
                    "GBP"
            );
            persistableCardDetails = CardDetails.builder()
                    .lastFour(gatewayResponse.lastFourDigits())
                    .token(gatewayResponse.token())
                    .expiryMonth(expiryMonth)
                    .expiryYear(expiryYear)
                    .holderName(cardDetailsRequestDto.holderName())
                    .billingAddress(convertToBillingAddress(dto.cardDetails().billingAddress()))
                    .build();
        } else if (dto.paymentMethod().equals(PaymentMethod.APPLE) || dto.paymentMethod()
                .equals(PaymentMethod.GOOGLE) || dto.paymentMethod().equals(PaymentMethod.PAYPAL)) {

            gatewayResponse = paymentGatewayClient.processTokenPayment(
                    dto.paymentToken(),
                    finalTotal,
                    "GBP"
            );

            persistableTokenizedPaymentDetails = TokenizedPaymentDetails.builder()
                    .token(gatewayResponse.token())
                    .lastFour(gatewayResponse.lastFourDigits())
                    .build();
        } else {
            throw new UnsupportedOperationException("Unsupported payment method: " + dto.paymentMethod());
        }

        if (! gatewayResponse.success()) {
            throw new PaymentFailedException(
                    gatewayResponse.message(),
                    gatewayResponse.errorCode(),
                    "0",
                    finalTotal,
                    "GBP",
                    dto.paymentMethod()
            );
        }


        return Payment.builder()
                .total(finalTotal)
                .paymentMethod(dto.paymentMethod())
                .transactionReference(gatewayResponse.transactionId())
                .tokenizedPaymentDetails(persistableTokenizedPaymentDetails)
                .cardDetails(persistableCardDetails)
                .build();
    }
}
