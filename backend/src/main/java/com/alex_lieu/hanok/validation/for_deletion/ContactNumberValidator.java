package com.alex_lieu.hanok.validation.for_deletion;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContactNumberValidator implements ConstraintValidator<ContactNumberConstraint, String> {

    String defaultCountryCode;

    @Override
    public void initialize(ContactNumberConstraint phoneNumber) {
        this.defaultCountryCode = phoneNumber.countryCode();
    }

    @Override
    public boolean isValid(String contactField, ConstraintValidatorContext constraintValidatorContext) {
        if (contactField == null || contactField.trim().isEmpty()) {
            return true;
        }
        PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
        try {
            Phonenumber.PhoneNumber parsedNumber = phoneUtil.parse(contactField, defaultCountryCode);
            return phoneUtil.isValidNumber(parsedNumber);
        } catch (com.google.i18n.phonenumbers.NumberParseException e) {
            return false;
        }
    }

}
