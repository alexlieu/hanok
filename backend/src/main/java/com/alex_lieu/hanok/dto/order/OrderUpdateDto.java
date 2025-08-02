package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.entity.CustomerOrder;
import jakarta.validation.constraints.FutureOrPresent;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

public record OrderUpdateDto(
        @FutureOrPresent(message = "{order.pickup.future}") LocalDate pickupDate,
        CustomerOrder.OrderStatus orderStatus,
        String specialInstructions,
        List<OrderItemUpdateDto> items
) implements Serializable {}
