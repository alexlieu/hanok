package com.alex_lieu.hanok.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.util.List;

public record OrderCreateDto(
        @NotEmpty(message = "{order.items.notempty}") List<OrderItemCreateDto> createOrderItemDtoList,
        @NotNull(message = "{person.id.notblank}") @Positive(message = "{person.id.positive}") Long customerId,
        String specialInstructions
) implements Serializable {}
