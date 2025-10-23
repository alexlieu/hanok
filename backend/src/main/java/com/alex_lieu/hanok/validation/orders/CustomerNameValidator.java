package com.alex_lieu.hanok.validation.orders; // Make sure this package is correct

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class CustomerNameValidator implements ConstraintValidator<ValidCustomerName, String> {

    private static final Pattern NAME_PATTERN = Pattern.compile("^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$");

    private final MessageSource messageSource;

    private ValidCustomerName.NameForType nameFor;

    @Autowired
    public CustomerNameValidator(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @Override
    public void initialize(ValidCustomerName constraintAnnotation) {
        this.nameFor = constraintAnnotation.nameFor();
    }

    @Override
    public boolean isValid(String customerName, ConstraintValidatorContext context) {
        if (customerName == null || customerName.isBlank()) {
            return true;
        }

        boolean nameForCard = nameFor == ValidCustomerName.NameForType.CARD;

        List<String> violations = new ArrayList<>();

        int length = customerName.length();
        if (length < 2 || length > 100) {
            violations.add(resolveMessage(nameForCard ? "card.holder-name.size" : "order.request.customer-name.size", 2, 100));
        }

        if (! NAME_PATTERN.matcher(customerName).matches()) {
            violations.add(resolveMessage(nameForCard ? "card.holder-name.pattern" : "order.request.customer-name.pattern"));
        }

        if (! violations.isEmpty()) {
            context.disableDefaultConstraintViolation();

            for (String violationMessage : violations) {
                context.buildConstraintViolationWithTemplate(violationMessage)
                        .addConstraintViolation();
            }
            return false;
        }

        return true;
    }

    private String resolveMessage(String key, Object... args) {
        try {
            String message = messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
            System.out.println("DEBUG: Successfully resolved message for key '" + key + "': " + message);
            return message;
        } catch (Exception e) {
            System.err.println("ERROR: Message key not found in ValidationMessages.properties: " + key);
            System.err.println("Exception: " + e.getMessage());
            return "Invalid value (" + key + ")";
        }
    }
}