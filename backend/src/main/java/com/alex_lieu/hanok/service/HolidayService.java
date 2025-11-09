package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.holiday.HolidayCheckResult;
import com.alex_lieu.hanok.entity.Holiday;
import com.alex_lieu.hanok.repository.HolidayRepository;
import com.alex_lieu.hanok.utils.orders.DateRange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HolidayService {
    private static final Logger logger = LoggerFactory.getLogger(HolidayService.class);

    private final HolidayRepository holidayRepository;

    private Set<DateRange> cachedHolidayRanges = new HashSet<>();
    private final Object cacheLock = new Object();

    public HolidayService(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public void refreshHolidayCache() {
        synchronized (cacheLock) {
            cachedHolidayRanges = holidayRepository.findAll().stream()
                    .map(holiday -> new DateRange(holiday.getStartDate(), holiday.getEndDate()))
                    .collect(Collectors.toSet());
            logger.info("Holiday cache refreshed. Current holidays in cache: {}", cachedHolidayRanges);
        }
    }

    public HolidayCheckResult isHoliday(LocalDate date) {
        synchronized (cacheLock) {
            for (DateRange holiday : cachedHolidayRanges) {
                if (holiday.isWithinRange(date)) {
                    return new HolidayCheckResult(
                            true,
                            Optional.of(holiday)
                    );
                }
            }
            return new HolidayCheckResult(
                    false,
                    Optional.empty()
            );
        }
    }

    public List<DateRange> convertHolidaysToDateRanges(List<Holiday> holidays) {
        if (holidays == null || holidays.isEmpty()) {
            return Collections.emptyList();
        }
        return holidays.stream().map(Holiday::toDateRange).collect(Collectors.toList());
    }

    public List<Holiday> findHolidaysInRange(LocalDate start, LocalDate end) {
        return holidayRepository.findOverlappingHolidays(start, end);
    }

    /**
     * Helper method to find the next available (i.e non-holiday) date.
     *
     * @param date The target date
     * @return The next valid non-holiday that is on or after the target date.
     */
    public LocalDate findNextAvailableDate(LocalDate date) {
        LocalDate availableDate = date;
        HolidayCheckResult holidayCheckResult = isHoliday(availableDate);
        while (holidayCheckResult.isHoliday()) {
            Optional<DateRange> violatedDateRange = holidayCheckResult.violatedDateRange();
            if (violatedDateRange.isPresent()) {
                availableDate = violatedDateRange.get().end().plusDays(1);
            } else {
                availableDate = availableDate.plusDays(1);
            }
            holidayCheckResult = isHoliday(availableDate);
        }
        return availableDate;
    }

    /**
     * Helper method to find the next available date on or before the given date.
     *
     * @param date
     * @return The latest valid non-holiday date that is on or before the target date.
     */
    public LocalDate findPreviousAvailableDate(LocalDate date) {
        LocalDate availableDate = date;
        HolidayCheckResult holidayCheckResult = isHoliday(availableDate);
        while (holidayCheckResult.isHoliday()) {
            Optional<DateRange> violateDateRange = holidayCheckResult.violatedDateRange();
            if (violateDateRange.isPresent()) {
                availableDate = violateDateRange.get().start().minusDays(1);
            } else {
                availableDate = availableDate.minusDays(1);
            }
            holidayCheckResult = isHoliday(availableDate);
        }
        return availableDate;
    }
}
