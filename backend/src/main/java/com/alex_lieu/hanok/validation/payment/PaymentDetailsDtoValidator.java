package com.alex_lieu.hanok.validation.payment;

import com.alex_lieu.hanok.dto.order.PaymentRequestDto;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentDetailsDtoValidator implements ConstraintValidator<ValidPaymentDetailsDto, PaymentRequestDto> {
    private static final Logger logger = LoggerFactory.getLogger(PaymentDetailsDtoValidator.class);
    @Override
    public void initialize(ValidPaymentDetailsDto constraintAnnotation) {
    }

    @Override
    public boolean isValid(PaymentRequestDto payment, ConstraintValidatorContext context) {
        if (payment == null) {
            return true;
        }
        PaymentMethod method = payment.paymentMethod();
        boolean hasPaymentToken = payment.paymentToken() != null && !payment.paymentToken().isBlank();
        boolean hasCardDetails = payment.cardDetails() != null;
        context.disableDefaultConstraintViolation();
        switch (method) {
            case CARD:
                logger.warn("Validating card payment details");
                if (! hasCardDetails) {
                    addConstraintViolation(context, "Card details are required for CARD payment method", "cardDetails");
                    return false;
                }
                if (hasPaymentToken) {
                    addConstraintViolation(context, "Payment token should not be provided for CARD payment method", "paymentToken");
                    return false;
                }
                break;
            case APPLE, GOOGLE, PAYPAL:
                if (hasCardDetails) {
                    addConstraintViolation(context, "Card details should not be provided for " + method + " payment method", "cardDetails");
                    return false;
                }
                if (! hasPaymentToken) {
                    addConstraintViolation(context, "Payment token is required for " + method + " payment method", "paymentToken");
                    return false;
                }
                break;
            default:
                addConstraintViolation(context, "Unsupported payment method: " + method, "paymentMethod");
                return false;
        }
        return true;
    }

    public void addConstraintViolation(ConstraintValidatorContext context, String constraintMessage, String fieldName) {
        context.buildConstraintViolationWithTemplate(constraintMessage)
                .addPropertyNode(fieldName)
                .addConstraintViolation();
    }
}
