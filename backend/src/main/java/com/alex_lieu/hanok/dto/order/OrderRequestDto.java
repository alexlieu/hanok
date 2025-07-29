package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.validation.ValidPhoneNumber;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.util.List;

public record OrderRequestDto(
        @Size(min = 2, max = 100, message = "card.holderName.size")
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "card.holderName.pattern")
        String customerName,

        @Positive(message = "{person.id.positive}")
        String customerId,

        @ValidPhoneNumber
        String phoneNumber,

        @Email(message = "{email.valid}")
        String email,

        @Valid
        @NotEmpty(message = "order.items.notEmpty")
        List<OrderItemRequestDto> orderItems,

        @Size(max = 500, message = "order.specialInstructions.size")
        String specialInstructions,

        @Valid
        @NotNull(message = "order.payment.notNull")
        PaymentRequestDto payment

) implements Serializable {
}
