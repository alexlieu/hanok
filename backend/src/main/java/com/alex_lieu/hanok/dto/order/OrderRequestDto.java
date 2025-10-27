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
        // \p{C} is a regex token that means any Unicode control character.
        // This includes newlines, tabs, carriage returns, null bytes, and other invisible/non-printable characters.
        // This is included in a minimal disallowed list as a security measure to prevent injection attacks against protocols and systems that use control characters as separators.
        // We want to be as permissive as possible with names.
        @Pattern(regexp = "^[^\\p{Cntrl}]+$", message = "{order.request.customer-name.pattern}", groups = {ValidationGroups.OrderChecks.class, ValidationGroups.FormatAndLogicChecks.class})
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
