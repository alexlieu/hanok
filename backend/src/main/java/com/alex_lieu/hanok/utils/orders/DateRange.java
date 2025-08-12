package com.alex_lieu.hanok.utils.orders;

import java.time.LocalDate;

public record DateRange(
        LocalDate start,
        LocalDate end
) {
    public DateRange {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Lower limit (" + start + ") cannot be greater than upper limit (" + end + ")");
        }
    }

    public static DateRange ofSingleDate(LocalDate singleDate) {
        return new DateRange(singleDate, singleDate);
    }

    public boolean isWithinRange(LocalDate date) {
        return ! date.isBefore(start) && ! date.isAfter(end);
    }

    public boolean isBeforeRange(LocalDate date) {
        return date.isBefore(start) || date.isEqual(start);
    }

    public boolean isAfterRange(LocalDate date) {
        return date.isAfter(end) || date.isEqual(end);
    }
}
