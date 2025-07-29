package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.validation.AtLeastOneRequired;
import com.alex_lieu.hanok.validation.ContactNumberConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.util.List;

@AtLeastOneRequired(fields = {"email", "phoneNumber"}, message = "{customer.contact.required}")
public record OrderCreateDto(
        @NotEmpty(message = "{order.items.notempty}") List<OrderItemCreateDto> createOrderItemDtoList,
        @Positive(message = "{person.id.positive}") Long customerId,
        @NotBlank(message = "{customer.name.notblank}") String customerName,
        @ContactNumberConstraint String phoneNumber,
        @Email(message = "{email.valid}") String email,
        PaymentCreateDto paymentCreateDto,
        String specialInstructions
) implements Serializable {}
