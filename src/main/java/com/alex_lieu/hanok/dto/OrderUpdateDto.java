package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.CustomerOrder;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public record OrderUpdateDto(
        @FutureOrPresent(message = "{order.pickup.future}") LocalDateTime pickupDateTime,
        CustomerOrder.OrderStatus orderStatus,
        String specialInstructions,
        List<OrderItemUpdateDto> items
) implements Serializable {}
