package com.alex_lieu.hanok.validation.payment;

import com.alex_lieu.hanok.entity.CardDetails;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.entity.TokenizedPaymentDetails;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PaymentDetailsValidator implements ConstraintValidator<ValidPaymentDetails, Payment> {
    public boolean isValid(Payment payment, ConstraintValidatorContext context) {

        if (payment == null || payment.getPaymentMethod() == null) {
            return true;
        }

        PaymentMethod method = payment.getPaymentMethod();
        CardDetails cardDetails = payment.getCardDetails();
        TokenizedPaymentDetails tokenizedPaymentDetails = payment.getTokenizedPaymentDetails();

        context.disableDefaultConstraintViolation();

        switch (method) {
            case CARD:
                if (cardDetails == null) {
                    addConstraintViolation(context, "Card details are required for 'CARD' payment method", "cardDetails");
                    return false;
                }
                if (tokenizedPaymentDetails != null) {
                    addConstraintViolation(context, "Tokenized payment cannot be provided for 'CARD' payment method", "tokenizedPaymentDetails");
                    return false;
                }
                break;
            case APPLE, GOOGLE, PAYPAL:
                if (tokenizedPaymentDetails == null) {
                    addConstraintViolation(context, "Tokenized payment details are required for " + method + " payment method", "tokenizedPaymentDetails");
                    return false;
                }
                if (cardDetails != null) {
                    addConstraintViolation(context, "Card details cannot be provided for " + method + " payment methods", "cardDetails");
                    return false;
                }
                break;
            default:
                addConstraintViolation(context, "Unsupported payment method: " + method, "paymentMethod");
        }
        return true;
    }

    public void addConstraintViolation(ConstraintValidatorContext context, String constraintMessage, String fieldName) {
        context.buildConstraintViolationWithTemplate(constraintMessage)
                .addPropertyNode(fieldName)
                .addConstraintViolation();
    }
}
