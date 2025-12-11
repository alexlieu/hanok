package com.alex_lieu.hanok.enums;

import com.alex_lieu.hanok.utils.orders.TimeRange;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.time.LocalTime;
import java.util.Arrays;

@Getter
public enum PickupSlot {
    SLOT_1(new TimeRange("2:00PM - 3:00PM", LocalTime.of(14,0), LocalTime.of(15, 0))),
    SLOT_2(new TimeRange("3:00PM - 4:00PM", LocalTime.of(15, 0), LocalTime.of(16, 0))),
    SLOT_3(new TimeRange("4:00PM - 5:00PM", LocalTime.of(16, 0), LocalTime.of(17, 0))),
    SLOT_4(new TimeRange("5:00PM - 6:00PM", LocalTime.of(17, 0), LocalTime.of(18, 0))),
    ;

    private final TimeRange timeRange;

    PickupSlot(TimeRange timeRange) {
        this.timeRange = timeRange;
    }

    public LocalTime getStartTime() {
        return timeRange.start();
    }

    public LocalTime getEndTime() {
        return timeRange.end();
    }

    @JsonValue
    public String getLabel() {
        return timeRange.label();
    }

    @JsonCreator
    public static PickupSlot fromString(String value) {
        if (value == null) return null;
        String normalized = value.trim().toUpperCase().replace("-", "_");
        return Arrays.stream(values())
                .filter(slot -> slot.name().equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid pickup slot: " + value));
    }
}
