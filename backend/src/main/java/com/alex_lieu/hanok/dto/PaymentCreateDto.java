package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record PaymentCreateDto(
        @NotBlank(message = "{payment.method.notblank}") PaymentMethod paymentMethod,
        @NotBlank(message = "{payment.status.notblank}") Payment.PaymentStatus paymentStatus
) implements Serializable {
}
