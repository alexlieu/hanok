package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.OrderItem;
import com.alex_lieu.hanok.entity.ProductVariant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link OrderItem}
 */
public record OrderItemViewDto(
        @NotBlank(message = "{product.name.notblank}") String itemName,
        @NotNull(message = "{variant.flavour.notnull}") ProductVariant.Flavour flavour,
        @NotNull(message = "{variant.size.notnull}") ProductVariant.Size size,
        @Positive(message = "{orderitem.quantity.positive}") Integer quantity,
        @Positive(message = "{orderitem.subtotal.positive}") BigDecimal subtotal,
        String notes
) implements Serializable {
    public static OrderItemViewDto fromOrderItem(OrderItem orderItem) {
        return new OrderItemViewDto(
                orderItem.getVariant().getProduct().getName(),
                orderItem.getVariant().getFlavour(),
                orderItem.getVariant().getSize(),
                orderItem.getQuantity(),
                orderItem.getSubtotal(),
                orderItem.getNotes()
        );
    }
}
