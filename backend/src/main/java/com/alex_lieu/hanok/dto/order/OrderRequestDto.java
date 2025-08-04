package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.validation.AtLeastOneRequired;
import com.alex_lieu.hanok.validation.ValidPhoneNumber;
import com.alex_lieu.hanok.validation.ValidPickupDate;
import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import jakarta.validation.GroupSequence;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@GroupSequence({OrderRequestDto.class, FirstValidationGroup.class, SecondValidationGroup.class})
@AtLeastOneRequired(fields = {"phoneNumber", "email"}, groups = {FirstValidationGroup.class})
public record OrderRequestDto(
        @NotBlank(message = "{order.request.customer-name.notBlank}", groups = {FirstValidationGroup.class})
        @Size(min = 2, max = 100, message = "{order.request.customer-name.size}", groups = {SecondValidationGroup.class})
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{order.request.customer-name.pattern}", groups = {SecondValidationGroup.class})
        String customerName,

        @Positive(message = "{person.id.positive}")
        String customerId,

        @ValidPhoneNumber(groups = {SecondValidationGroup.class})
        String phoneNumber,

        @Email(message = "{email.valid}", groups = {SecondValidationGroup.class})
        String email,

        @Valid
        @NotEmpty(message = "{order.items.not-empty}")
        List<OrderItemRequestDto> orderItems,

        @Size(max = 500, message = "{order.special-instructions.size}")
        String specialInstructions,

        @Valid
        @NotNull(message = "{order.payment.notNull}")
        PaymentRequestDto payment,

        @NotNull(message = "{order.pickup-date.notNull}")
        @ValidPickupDate
        LocalDate pickupDate

) implements Serializable {
}
