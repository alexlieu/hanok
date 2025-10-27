package com.alex_lieu.hanok.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

import java.io.Serializable;
import java.util.Optional;

public record OrderItemRequestDto(
        @NotNull(message = "{variant.id.notnull}") @Positive(message = "{variant.id.positive}")
        long productVariantId,

        @Range(min = 1, max = 10, message = "{orderitem.quantity.range}")
        int quantity,

        @Size(max = 500, message = "orderItem.notes.size")
        String notes
) implements Serializable {
    public OrderItemRequestDto(long productVariantId, int quantity, String notes) {
        this.productVariantId = productVariantId;
        this.quantity = quantity;
        this.notes = Optional.ofNullable(notes).map(String::trim).orElse(null);
    }
}
