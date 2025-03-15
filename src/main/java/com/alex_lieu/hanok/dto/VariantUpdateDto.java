package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.model.ProductVariant;

import java.io.Serializable;
import java.math.BigDecimal;

public record VariantUpdateDto(long id, BigDecimal price, ProductVariant.Flavour flavour, ProductVariant.Size size, boolean active, boolean available) implements Serializable {
}
