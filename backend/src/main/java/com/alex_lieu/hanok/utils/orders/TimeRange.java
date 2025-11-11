package com.alex_lieu.hanok.utils.orders;

import java.time.LocalTime;

public record TimeRange(
        String label,
        LocalTime start,
        LocalTime end
) {
    public TimeRange {
        if (end.isBefore(start)) {
            throw new IllegalArgumentException(String.format("Start time %s cannot be before end time %s", start, end));
        }
    }
}
