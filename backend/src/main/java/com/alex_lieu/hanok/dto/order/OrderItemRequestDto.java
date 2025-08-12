package com.alex_lieu.hanok.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

import java.io.Serializable;

public record OrderItemRequestDto(
        @NotNull(message = "{variant.id.notnull}") @Positive(message = "{variant.id.positive}")
        long produceVariantId,

        @Range(min = 1, max = 10, message = "{orderitem.quantity.range}")
        int quantity,

        @Size(max = 500, message = "orderItem.notes.size")
        String notes
) implements Serializable {
}
