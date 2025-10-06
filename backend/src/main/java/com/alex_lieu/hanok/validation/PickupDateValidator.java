package com.alex_lieu.hanok.validation;

import com.alex_lieu.hanok.service.PickupService;
import com.alex_lieu.hanok.utils.orders.DateRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class PickupDateValidator implements ConstraintValidator<ValidPickupDate, LocalDate> {
    private final LocalTime cutoffTime;
    private final String timezone;
    private final PickupService pickupService;

    public PickupDateValidator(
            @Value("${app.order.pickup.cutoff.hour}") int cutoffHour,
            @Value("${app.order.pickup.cutoff.minute}") int cutoffMin,
            @Value("${app.order.pickup.timezone}") String timezone,
            PickupService pickupService
    ) {
        this.cutoffTime = LocalTime.of(cutoffHour, cutoffMin);
        this.timezone = timezone;
        this.pickupService = pickupService;
    }

    @Override
    public boolean isValid(LocalDate pickupDate, ConstraintValidatorContext constraintValidatorContext) {
        if (pickupDate == null) {
            return true;
        }
        DateRange validPickupDateRange = pickupService.getValidPickupDateRange();

        if (! validPickupDateRange.isWithinRange(pickupDate)) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            String messageTemplate = constraintValidatorContext.getDefaultConstraintMessageTemplate();
            String customizedMessage = messageTemplate
                    .replace("{earliestPickupDate}", validPickupDateRange.start()
                            .format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                    .replace("{latestPickupDate}", validPickupDateRange.end()
                            .format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                    .replace("{cutoffTime}", this.cutoffTime.toString())
                    .replace("{timezone}", timezone);
            constraintValidatorContext.buildConstraintViolationWithTemplate(customizedMessage)
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
