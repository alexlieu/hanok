package com.alex_lieu.hanok.validation.expiry_date;

import com.alex_lieu.hanok.entity.CardDetails;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.DateTimeException;
import java.time.YearMonth;

public class CardExpirationValidator implements ConstraintValidator<ValidCardExpiration, CardDetails> {
    public boolean isValid(CardDetails cardDetails, ConstraintValidatorContext context) {
        if (cardDetails == null) {
            return true;
        }
        String expiryMonth = cardDetails.getExpiryMonth();
        String expiryYear = cardDetails.getExpiryYear();
        context.disableDefaultConstraintViolation();
        try {
            int month = Integer.parseInt(expiryMonth);
            int year = Integer.parseInt(expiryYear);
            YearMonth expiry = YearMonth.of(year, month);
            YearMonth now = YearMonth.now();
            if (expiry.isBefore(now)) {
                addConstraintViolation(context, "card.expiry.expired", "expiryYear");
                return false;
            }
            YearMonth maxExpiry = now.plusYears(15);
            if (expiry.isAfter(maxExpiry)) {
                addConstraintViolation(context, "card.expiry.invalid", "expiryYear");
                return false;
            }
        } catch (NumberFormatException | DateTimeException e) {
            addConstraintViolation(context, "card.expiry.expired", "expiryYear");
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
