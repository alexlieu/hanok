package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.config.PickupRulesDto;
import com.alex_lieu.hanok.utils.orders.DateRange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;

@Service
public class PickupService {
    private final int requiredLeadDays;
    private final int maxMonths;
    private final int cutoffHour;
    private final int cutoffMin;
    private final LocalTime cutoffTime;
    private final ZoneId timezoneId;
    private final String timezone;
    private final HolidayService holidayService;

    public PickupService(
            @Value("${app.order.pickup.min-lead-days}") int requiredLeadDays,
            @Value("${app.order.pickup.max-months}") int maxMonths,
            @Value("${app.order.pickup.cutoff.hour}") int cutoffHour,
            @Value("${app.order.pickup.cutoff.minute}") int cutoffMin,
            @Value("${app.order.pickup.timezone}") String timezone,
            HolidayService holidayService
    ) {
        this.requiredLeadDays = requiredLeadDays;
        this.maxMonths = maxMonths;
        this.cutoffHour = cutoffHour;
        this.cutoffMin = cutoffMin;
        this.cutoffTime = LocalTime.of(cutoffHour, cutoffMin);
        this.timezoneId = ZoneId.of(timezone);
        this.timezone = timezone;
        this.holidayService = holidayService;
    }

    public DateRange getValidPickupDateRange() {
        LocalDateTime now = LocalDateTime.now(timezoneId);
        LocalDate effectiveBaseDate = now.toLocalDate();
        if (now.toLocalTime().isAfter(cutoffTime)) {
            effectiveBaseDate = effectiveBaseDate.plusDays(1);
        }
        LocalDate earliestPickupDate = effectiveBaseDate.plusDays(requiredLeadDays);
        LocalDate latestPickupDate = effectiveBaseDate.plusMonths(maxMonths);
        return new DateRange(earliestPickupDate, latestPickupDate);
    }

    public PickupRulesDto getPickupRules() {
        DateRange validPickupDateRange = getValidPickupDateRange();
        Set<DateRange> holidayRanges = holidayService.getHolidaysForDateRange(validPickupDateRange.start(), validPickupDateRange.end());
        return new PickupRulesDto(
                requiredLeadDays,
                cutoffHour,
                cutoffMin,
                maxMonths,
                timezone,
                List.copyOf(holidayRanges)
        );
    }
}
