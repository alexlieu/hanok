package com.alex_lieu.hanok.validation.payment;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;


public class CardNumberValidator implements ConstraintValidator<ValidCardNumber, String> {

    private static final Pattern VISA_PATTERN = Pattern.compile("^4");
    private static final Pattern MASTERCARD_PATTERN = Pattern.compile("^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)");
    private static final Pattern AMEX_PATTERN = Pattern.compile("^3[47]");

    @Override
    public boolean isValid(String input, ConstraintValidatorContext context) {
        if (input == null || input.isEmpty()) return true;
        String cleanedInput = input.trim().replaceAll("\\D", "");
        int length = cleanedInput.length();
        if (length != 13 && length != 15 && length != 16 && length != 19) return false;
        if (! luhnTest(cleanedInput)) return false;
        if (! isValidIssuingBank(cleanedInput, length)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Your card number is not from an accepted bank (Visa, MC, Amex).")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }

    private boolean luhnTest(String input) {
        String cleanedInput = input.trim().replaceAll("\\D", "");
        if (cleanedInput.length() < 2) return false;
        int checkDigit = Character.getNumericValue(cleanedInput.charAt(cleanedInput.length() - 1));
        String payload = cleanedInput.substring(0, cleanedInput.length() - 1);
        String digitsReversed = new StringBuilder(payload).reverse().toString();
        int sum = 0;
        for (int step = 0; step < digitsReversed.length(); step++) {
            int digit = Character.getNumericValue(digitsReversed.charAt(step));
            if (step % 2 == 0) {
                int doubleDigit = digit * 2;
                sum += doubleDigit > 9 ? doubleDigit - 9 : doubleDigit;
            } else {
                sum += digit;
            }
        }
        int totalSum = sum + checkDigit;
        return totalSum % 10 == 0;
    }

    private boolean isValidIssuingBank(String cardNumber, int length) {
        if (VISA_PATTERN.matcher(cardNumber).find()) return length == 13 || length == 16 || length == 19;
        if (MASTERCARD_PATTERN.matcher(cardNumber).find()) return length == 16;
        if (AMEX_PATTERN.matcher(cardNumber).find()) return length == 15;
        return false;
    }
}
