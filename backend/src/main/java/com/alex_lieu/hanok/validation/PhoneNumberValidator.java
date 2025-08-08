package com.alex_lieu.hanok.validation;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Locale;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {
    @Override
    public boolean isValid(String phoneNumberStr, ConstraintValidatorContext context) {
        if (phoneNumberStr == null || phoneNumberStr.isEmpty()) {
            return true;
        }
        PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
        try {
            Phonenumber.PhoneNumber phoneNumber = phoneUtil.parse(phoneNumberStr, "ZZ");
            boolean isValid = phoneUtil.isValidNumber(phoneNumber);
            if (! isValid) {
                int numericCountryCode = phoneNumber.getCountryCode();
                String regionCode = phoneUtil.getRegionCodeForCountryCode(numericCountryCode);
                Locale locale = Locale.of("", regionCode);
                String countryName = locale.getDisplayName();
                context.disableDefaultConstraintViolation();
                String messageTemplate = context.getDefaultConstraintMessageTemplate();
                String errorMessage = messageTemplate.replace("{country}", countryName);
                context.buildConstraintViolationWithTemplate(errorMessage).addPropertyNode("countryCode")
                        .addConstraintViolation();
            }
            return isValid;
        } catch (NumberParseException e) {
            context.disableDefaultConstraintViolation();
            String errorMessage = "Phone number could not be parsed. Please ensure it contains only digits and a valid country code.";
            context.buildConstraintViolationWithTemplate(errorMessage).addPropertyNode("countryCode")
                    .addConstraintViolation();
            return false;
        }
    }
}
