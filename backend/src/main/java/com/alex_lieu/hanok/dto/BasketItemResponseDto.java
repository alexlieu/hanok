package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.ProductVariant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;

public record BasketItemResponseDto(
        @NotBlank(message = "{product.name.notblank}") String productName,
        @NotNull(message = "{variant.flavour.notnull}") ProductVariant.Flavour flavour,
        @NotNull(message = "{variant.size.notnull}") ProductVariant.Size size,
        @Positive(message = "{unitprice.positive}") @NotNull(message = "{unitprice.notnull}") BigDecimal unitPrice,
        @Positive(message = "{subtotal.positive}") @NotNull(message = "{subtotal.notnull}") BigDecimal subTotal,
        @Positive(message = "{variant.id.positive}") @NotNull(message = "{variant.id.notnull}") Long variantId,
        @Positive(message = "{orderitem.quantity.notnull}") Integer quantity
) implements Serializable {
}
