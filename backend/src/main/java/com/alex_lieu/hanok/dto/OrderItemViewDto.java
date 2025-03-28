package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.OrderItem;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for {@link OrderItem}
 */
public record OrderItemViewDto(
        long id,
        @Size(min=3, max=3) @NotEmpty List<String> itemName,
        @Positive(message = "{orderitem.quantity.positive}") Integer quantity,
        @Positive(message = "{orderitem.subtotal.positive}") BigDecimal subtotal,
        String notes
) implements Serializable {}
