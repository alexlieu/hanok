package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.ProductVariant;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;

public record VariantUpdateDto(
        long id,
        @Positive BigDecimal price,
        @NotNull ProductVariant.Flavour flavour,
        @NotNull ProductVariant.Size size,
        Boolean active,
        Boolean available
) implements Serializable {}
