package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.ProductVariant;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;

public record VariantUpdateRequestDto(
        @Positive(message = "{variant.price.positive}") BigDecimal price,
        @NotNull(message = "{variant.flavour.notnull}") ProductVariant.Flavour flavour,
        @NotNull(message = "{variant.size.notnull}") ProductVariant.Size size,
        Boolean active,
        Boolean available
) implements Serializable {}
