package com.alex_lieu.hanok.dto.config;

import com.alex_lieu.hanok.utils.orders.TimeRange;

import java.io.Serializable;
import java.time.DayOfWeek;

public record OpeningHours(
        DayOfWeek dayOfWeek,
        TimeRange timeRange
) implements Serializable {
}
