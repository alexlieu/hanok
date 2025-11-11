package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.config.StoreConfig;
import com.alex_lieu.hanok.dto.config.OpeningHours;
import com.alex_lieu.hanok.dto.config.PickupRulesDto;
import com.alex_lieu.hanok.dto.config.PickupSlotDto;
import com.alex_lieu.hanok.dto.holiday.PickupDateDetails;
import com.alex_lieu.hanok.entity.Holiday;
import com.alex_lieu.hanok.enums.PickupSlot;
import com.alex_lieu.hanok.utils.orders.DateRange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    private final StoreConfig storeConfig;

    public PickupService(
            @Value("${app.order.pickup.min-lead-days}") int requiredLeadDays,
            @Value("${app.order.pickup.max-months}") int maxMonths,
            @Value("${app.order.pickup.cutoff.hour}") int cutoffHour,
            @Value("${app.order.pickup.cutoff.minute}") int cutoffMin,
            @Value("${app.order.pickup.timezone}") String timezone,
            HolidayService holidayService,
            StoreConfig storeConfig
    ) {
        this.requiredLeadDays = requiredLeadDays;
        this.maxMonths = maxMonths;
        this.cutoffHour = cutoffHour;
        this.cutoffMin = cutoffMin;
        this.cutoffTime = LocalTime.of(cutoffHour, cutoffMin);
        this.timezoneId = ZoneId.of(timezone);
        this.timezone = timezone;
        this.holidayService = holidayService;
        this.storeConfig = storeConfig;
    }

    public DateRange getValidPickupDateRange() {
        return getValidPickupDateRange(LocalDateTime.now(ZoneId.of(timezone)));
    }

    public DateRange getValidPickupDateRange(LocalDateTime now) {
        LocalDate candidateDate = now.toLocalDate();

        if (now.toLocalTime().isAfter(cutoffTime)) {
            candidateDate = candidateDate.plusDays(1);
        }

        LocalDate earliestPickup = holidayService.findNextAvailableDate(candidateDate.plusDays(requiredLeadDays));

        LocalDate latestPickup = earliestPickup.plusMonths(maxMonths);
        latestPickup = holidayService.findPreviousAvailableDate(latestPickup);

        return new DateRange(earliestPickup, latestPickup);
    }

    public PickupDateDetails getPickupDateDetails(LocalDate baseDate) {
        DateRange validPickupDateRange = getValidPickupDateRange();
        List<Holiday> holidaysInRange = holidayService.findHolidaysInRange(
                baseDate,
                validPickupDateRange.end()
        );
        return new PickupDateDetails(validPickupDateRange, holidaysInRange);
    }

    public PickupRulesDto getPickupRules() {
        LocalDate today = LocalDate.now(timezoneId);
        return getPickupRules(today);
    }

    public PickupRulesDto getPickupRules(LocalDate baseDate) {
        PickupDateDetails pickupDateDetails = getPickupDateDetails(baseDate);
        List<DateRange> overlappingHolidayDateRanges = holidayService.convertHolidaysToDateRanges(pickupDateDetails.holidaysInRange());
        List<PickupSlotDto> pickupSlots = Arrays.stream(PickupSlot.values())
                .map(slot -> new PickupSlotDto(slot.name(), slot.getLabel(), slot.getStartTime(), slot.getEndTime()))
                .collect(Collectors.toList());
        List<OpeningHours> openingHours = storeConfig.getOpeningHours().entrySet().stream()
                .map(entry -> new OpeningHours(entry.getKey(), entry.getValue())).toList();
        System.out.println("Opening hours: " + openingHours);
        return new PickupRulesDto(
                requiredLeadDays,
                cutoffHour,
                cutoffMin,
                maxMonths,
                timezone,
                overlappingHolidayDateRanges,
                pickupDateDetails.validRange().start(),
                pickupDateDetails.validRange().end(),
                pickupSlots,
                openingHours
        );
    }
}
