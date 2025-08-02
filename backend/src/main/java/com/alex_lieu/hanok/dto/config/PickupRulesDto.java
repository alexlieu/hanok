package com.alex_lieu.hanok.dto.config;

import com.alex_lieu.hanok.utils.orders.DateRange;

import java.io.Serializable;
import java.util.List;

public record PickupRulesDto(
        int requiredLeadDays,
        int cutoffHour,
        int cutoffMin,
        int maxMonth,
        String timezone,
        List<DateRange> holidayRanges
) implements Serializable {
}
