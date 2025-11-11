package com.alex_lieu.hanok.config;

import com.alex_lieu.hanok.utils.orders.TimeRange;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Configuration service for store settings, including opening hours.
 * This service makes store configuration globally available throughout the
 * application.
 */
@Configuration
@ConfigurationProperties(prefix = "store")
public class StoreConfig {
    private Map<DayOfWeek, String> rawOpeningHours;
    private Map<DayOfWeek, TimeRange> parsedOpeningHours;

    /**
     * The required setter for Spring to inject the properties.
     *
     * @param openingHours raw opening hours data.
     */
    public void setOpeningHours(Map<DayOfWeek, String> openingHours) {
        this.rawOpeningHours = openingHours;
    };

    /**
     * This method runs after Spring injects the openingHours map.
     * It parses the raw strings into TimeRange objects.
     */
    @PostConstruct
    public void parseHours() {
        if (rawOpeningHours == null) {
            this.parsedOpeningHours = new EnumMap<>(DayOfWeek.class);
            return;
        }
        this.parsedOpeningHours = this.rawOpeningHours.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey, // e.g., DayOfWeek.MONDAY
                        entry -> parseTimeRange(entry.getValue()), // e.g., TimeRange(9:00, 19:00)
                        (oldVal, newVal) -> newVal, // Merge function
                        () -> new EnumMap<>(DayOfWeek.class) // Ensure it's an efficient EnumMap
                ));    }

    /**
     * Helper method to parse a string e.g. "9-19" into a TimeRange
     * @param hoursString raw date range string
     * @return TimeRange object as a result of parsing raw strings formatted as NN-NN
     */
    private TimeRange parseTimeRange(String hoursString) {
        try {
            String[] parts = hoursString.split("-");
            int startHourInt = Integer.parseInt(parts[0]);
            int endHourInt = Integer.parseInt(parts[1]);
            LocalTime startTime = LocalTime.of(startHourInt, 0);
            LocalTime endTime = LocalTime.of(endHourInt, 0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mma", Locale.ENGLISH);
            return new TimeRange(startTime.format(formatter)+" - "+endTime.format(formatter), startTime, endTime);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid opening hours format in application.properties. Expected HH-HH, got: " + hoursString, ex);        }
    }

    /**
     * Get the parsed opening hours for all days of the week.
     *
     * @return Map where the key is DayOfWeek and value is a TimeRange object.
     */
    public Map<DayOfWeek, TimeRange> getOpeningHours() {
        return parsedOpeningHours;
    }

    /**
     * Get the parsed opening hours for a specific day.
     *
     * @param day Day of the week
     * @return TimeRange object or null if not found.
     */
    public TimeRange getOpeningHoursForDay(DayOfWeek day) {
        return parsedOpeningHours.get(day);
    }
}
