package com.alex_lieu.hanok.dto.holiday;

import com.alex_lieu.hanok.entity.Holiday;
import com.alex_lieu.hanok.utils.orders.DateRange;

import java.io.Serializable;
import java.util.List;

public record PickupDateDetails(
        DateRange validRange,
        List<Holiday> holidaysInRange
) implements Serializable {
}
