package com.alex_lieu.hanok.validation;

import com.alex_lieu.hanok.dto.holiday.HolidayCheckResult;
import com.alex_lieu.hanok.service.HolidayService;
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
    private final HolidayService holidayService;
    private final PickupService pickupService;

    public PickupDateValidator(
            @Value("${app.order.pickup.cutoff.hour}") int cutoffHour,
            @Value("${app.order.pickup.cutoff.minute}") int cutoffMin,
            @Value("${app.order.pickup.timezone}") String timezone,
            HolidayService holidayService,
            PickupService pickupService
    ) {
        this.cutoffTime = LocalTime.of(cutoffHour, cutoffMin);
        this.timezone = timezone;
        this.holidayService = holidayService;
        this.pickupService = pickupService;
    }

    @Override
    public boolean isValid(LocalDate pickupDate, ConstraintValidatorContext constraintValidatorContext) {
        if (pickupDate == null) {
            return true;
        }
        DateRange validPickupDateRange = pickupService.getValidPickupDateRange();
        LocalDate earliestPickupDate = validPickupDateRange.start();
        LocalDate latestPickupDate = validPickupDateRange.end();

        HolidayCheckResult holidayCheckResult = holidayService.isHoliday(pickupDate);

        if (holidayCheckResult.isHoliday()) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            String messageTemplate = "Pickup date falls within a shop holiday from {start} to {end}";
            holidayCheckResult.violatedDateRange().ifPresent(d -> {
                String customizedMessage = messageTemplate
                        .replace("{start}", d.start().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                        .replace("{end}", d.end().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
                constraintValidatorContext.buildConstraintViolationWithTemplate(customizedMessage)
                        .addConstraintViolation();
            });
            return false;
        }

        boolean isValid = new DateRange(earliestPickupDate, latestPickupDate).isWithinRange(pickupDate);
//        boolean isValid = pickupDate.isAfter(earliestPickupDate) && pickupDate.isBefore(latestPickupDate);

        if (! isValid) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            String messageTemplate = constraintValidatorContext.getDefaultConstraintMessageTemplate();
            String customizedMessage = messageTemplate
                    .replace("{earliestPickupDate}", earliestPickupDate.format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                    .replace("{latestPickupDate}", latestPickupDate.format(DateTimeFormatter.ofPattern("dd MMMM yyyy")))
                    .replace("{cutoffTime}", this.cutoffTime.toString())
                    .replace("{timezone}", timezone);
            constraintValidatorContext.buildConstraintViolationWithTemplate(customizedMessage)
                    .addConstraintViolation();
        }
        return isValid;
    }
}
