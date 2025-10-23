package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.validation.AtLeastOneRequired;
import com.alex_lieu.hanok.validation.ValidPhoneNumber;
import com.alex_lieu.hanok.validation.ValidPickupDate;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@AtLeastOneRequired(fields = {"phoneNumber", "email"}, groups = {ValidationGroups.OrderChecks.class,
        ValidationGroups.FormatAndLogicChecks.class})
public record OrderRequestDto(
        @NotBlank(message = "{order.request.customer-name.not-blank}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.PreConditionChecks.class})
        @Size(min = 2, max = 100, message = "{order.request.customer-name.size}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{order.request.customer-name.pattern}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String fullName,

        @Positive(message = "{person.id.positive}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String customerId,

        @ValidPhoneNumber(groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String phoneNumber,

        @Email(message = "{email.valid}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        String email,

        @Valid
        @NotEmpty(message = "{order.items.not-empty}", groups = {ValidationGroups.OrderChecks.class})
        List<OrderItemRequestDto> orderItems,

        @Size(max = 500, message = "{order.special-instructions.size}", groups = {ValidationGroups.OrderChecks.class})
        String specialInstructions,

        @Valid
        @NotNull(message = "{order.payment.not-null}", groups = {ValidationGroups.OrderChecks.class})
        PaymentRequestDto payment,

        @NotNull(message = "{order.pickup-date.not-null}", groups = {ValidationGroups.OrderChecks.class}) @ValidPickupDate(groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
        LocalDate pickupDate

) implements Serializable {
}
