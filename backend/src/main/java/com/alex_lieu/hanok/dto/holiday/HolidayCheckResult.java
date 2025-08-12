package com.alex_lieu.hanok.dto.holiday;

import com.alex_lieu.hanok.utils.orders.DateRange;

import java.io.Serializable;
import java.util.Optional;

public record HolidayCheckResult(boolean isHoliday, Optional<DateRange> violatedDateRange) implements Serializable {
}
