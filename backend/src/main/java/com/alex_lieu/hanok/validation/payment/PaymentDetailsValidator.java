package com.alex_lieu.hanok.validation.payment;

import com.alex_lieu.hanok.entity.CardDetails;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.entity.TokenizedPaymentDetails;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PaymentDetailsValidator implements ConstraintValidator<ValidPaymentDetails, Payment> {
    public boolean isValid(Payment payment, ConstraintValidatorContext context) {
        if (payment == null) {
            return true;
        }

        PaymentMethod method = payment.getPaymentMethod();
        CardDetails cardDetails = payment.getCardDetails();
        TokenizedPaymentDetails tokenizedPaymentDetails = payment.getTokenizedPaymentDetails();

        if (method == null) {
            return false;
        }

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
//        PaymentMethod paymentMethod = payment.getPaymentMethod();
//        boolean hasCardDetails = (payment.getCardDetails() != null);
//        if (paymentMethod == PaymentMethod.CARD) {
//            if (! hasCardDetails) {
//                addConstraintViolation(context, "Card details are required for 'CARD' payment method", "cardDetails");
//                return false;
//            }
//        } else {
//            if (hasCardDetails) {
//                addConstraintViolation(context, "Card details should not be provided for " + paymentMethod.getDisplayName() + " payment method", "cardDetails");
//                return false;
//            }
//        }
        return true;
    }

    public void addConstraintViolation(ConstraintValidatorContext context, String constraintMessage, String fieldName) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(constraintMessage)
                .addPropertyNode(fieldName)
                .addConstraintViolation();
    }
}
