package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.holiday.HolidayCheckResult;
import com.alex_lieu.hanok.repository.HolidayRepository;
import com.alex_lieu.hanok.utils.orders.DateRange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
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

    public Set<DateRange> getHolidaysForDateRange(LocalDate start, LocalDate end) {
        return holidayRepository.findByStartDateBetweenOrEndDateBetween(start, end, start, end)
                .stream()
                .map(holiday -> new DateRange(holiday.getStartDate(), holiday.getEndDate()))
                .collect(Collectors.toSet());
    }
}
