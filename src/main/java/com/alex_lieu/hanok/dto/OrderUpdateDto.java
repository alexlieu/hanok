package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.CustomerOrder;

import java.io.Serializable;
import java.time.LocalDateTime;

public record OrderUpdateDto(
        LocalDateTime pickupDateTime,
        CustomerOrder.OrderStatus orderStatus
) implements Serializable {}
