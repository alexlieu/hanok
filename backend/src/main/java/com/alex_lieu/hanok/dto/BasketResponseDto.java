package com.alex_lieu.hanok.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public record BasketResponseDto(
        @NotNull(message = "{basket.notempty}") List<BasketItemResponseDto> items,
        @Positive(message = "{total.positive}") BigDecimal total
) implements Serializable {
}
