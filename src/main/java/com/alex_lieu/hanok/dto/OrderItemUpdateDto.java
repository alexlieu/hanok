package com.alex_lieu.hanok.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;

public record OrderItemUpdateDto(
        @NotNull(message = "{variant.id.notblank}") @Positive(message = "{variant.id.positive}") long variantId,
        @Positive(message = "{orderitem.quantity.positive}") Integer quantity,
        String notes
) implements Serializable {}
