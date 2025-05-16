package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.OrderItem;
import com.alex_lieu.hanok.entity.ProductVariant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.Range;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link OrderItem}
 */
public record OrderItemViewDto(
        @NotBlank(message = "{product.name.notblank}") String itemName,
        @NotNull(message = "{variant.flavour.notnull}") ProductVariant.Flavour flavour,
        @NotNull(message = "{variant.size.notnull}") ProductVariant.Size size,
        @Range(min = 1, max = 10, message = "{orderitem.quantity.range}") Integer quantity,
        @Positive(message = "{unitprice.positive}") @NotNull(message = "{unitprice.notnull}") BigDecimal unitPrice,
        @Positive(message = "{orderitem.subtotal.positive}") BigDecimal subtotal,
        String notes
) implements Serializable {
    public static OrderItemViewDto fromOrderItem(OrderItem orderItem) {
        return new OrderItemViewDto(
                orderItem.getVariant().getProduct().getName(),
                orderItem.getVariant().getFlavour(),
                orderItem.getVariant().getSize(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getSubtotal(),
                orderItem.getNotes()
        );
    }
}
