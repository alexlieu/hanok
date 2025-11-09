package com.alex_lieu.hanok.config;

import com.alex_lieu.hanok.entity.Holiday;
import com.alex_lieu.hanok.repository.HolidayRepository;
import com.alex_lieu.hanok.service.HolidayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile({"dev", "test"})
public class HolidayDataLoader implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(HolidayDataLoader.class);

    private final HolidayRepository holidayRepository;
    private final HolidayService holidayService;

    public HolidayDataLoader(HolidayRepository holidayRepository, HolidayService holidayService) {
        this.holidayRepository = holidayRepository;
        this.holidayService = holidayService;
    }

    public void createHoliday(List<Holiday> holidays, String name, LocalDate startDate, LocalDate endDate) {
        Holiday holiday = Holiday.builder()
                .name(name)
                .startDate(startDate)
                .endDate(endDate)
                .build();
        holidays.add(holiday);
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Checking holiday database for existing data...");
        List<Holiday> holidays = new ArrayList<>();
        if (holidayRepository.count() == 0) {
            logger.info("Holiday table is empty. Populating with initial data.");
            createHoliday(holidays, "augBank", LocalDate.of(2025, 8, 25), LocalDate.of(2025, 8, 25));
            createHoliday(holidays, "personal", LocalDate.of(2025, 9, 5), LocalDate.of(2025, 9, 8));
            createHoliday(holidays, "personal", LocalDate.of(2025, 10, 1), LocalDate.of(2025, 10, 13));
            createHoliday(holidays, "personal", LocalDate.of(2025, 11, 8), LocalDate.of(2025, 11, 13));
            createHoliday(holidays, "christmas", LocalDate.of(2025, 12, 24), LocalDate.of(2025, 12, 28));
            holidayRepository.saveAll(holidays);
            logger.info("Successfully populated holiday table with {} entries.", holidayRepository.count());
            holidayService.refreshHolidayCache();
        } else {
            logger.info("Holiday table already contains {} entries. Skipping data loading.", holidayRepository.count());
        }
    }
}
