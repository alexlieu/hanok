package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.OrderItem;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link com.alex_lieu.hanok.model.CustomerOrder}
 */
public record OrderDto(
        long id,
        LocalDateTime pickupDateTime,
        @NotNull CustomerOrder.OrderStatus orderStatus,
        String specialInstructions,
        @NotEmpty List<OrderItemDto> orderItemDtos,
        @NotNull CustomerDto customerDto
) implements Serializable {}
