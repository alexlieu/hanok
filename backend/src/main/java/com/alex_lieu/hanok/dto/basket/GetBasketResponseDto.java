package com.alex_lieu.hanok.dto.basket;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public record GetBasketResponseDto(
        @NotEmpty(message = "{basket.not-empty}")
        List<GetBasketItemResponseDto> items,

        @DecimalMin(value = "0.0", message = "{basket.total.decimal-min}")
        BigDecimal total
) implements Serializable {
}
