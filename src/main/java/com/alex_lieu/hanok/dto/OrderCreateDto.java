package com.alex_lieu.hanok.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.util.List;

public record CreateOrderDto(
        @NotEmpty(message = "{order.items.notempty}") List<CreateOrderItemDto> createOrderItemDtoList,
        @NotNull(message = "{person.id.notblank}") @Positive(message = "{person.id.positive}") Long customerId,
        String specialInstructions
) implements Serializable {}
