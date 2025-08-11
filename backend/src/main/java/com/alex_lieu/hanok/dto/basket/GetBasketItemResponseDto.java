package com.alex_lieu.hanok.dto.basket;

import com.alex_lieu.hanok.entity.ProductVariant;
import org.hibernate.validator.constraints.Range;

import java.io.Serializable;
import java.math.BigDecimal;

public record GetBasketItemResponseDto(
        String productName,
        ProductVariant.Flavour flavour,
        ProductVariant.Size size,
        BigDecimal unitPrice,
        BigDecimal subTotal,
        long variantId,
        @Range(min = 0, max = 10, message = "{}") int quantity
) implements Serializable {
}
