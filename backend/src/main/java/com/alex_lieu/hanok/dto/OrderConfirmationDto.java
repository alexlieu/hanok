package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderConfirmationDto(
        @NotNull(message = "{order.number.notnull}") String orderNumber,
        @NotNull(message = "{order.status.notnull}") CustomerOrder.OrderStatus orderStatus,
        @Past(message = "{order.confirmation.datetime.past}") LocalDateTime orderDateTime,
        @NotEmpty(message = "{order.items.notempty}") List<OrderItemViewDto> orderItems,
        @Positive(message = "{order.total.positive}") BigDecimal total,
        @NotBlank(message = "{payment.method.notblank}") PaymentMethod paymentMethod,
        @NotBlank(message = "{payment.status.notblank}") Payment.PaymentStatus paymentStatus,
        String specialInstructions
) implements Serializable {
    public static OrderConfirmationDto fromOrder(CustomerOrder order) {
        return new OrderConfirmationDto(
                order.getOrderNumber(),
                order.getOrderStatus(),
                order.getOrderDateTime(),
                order.getOrderItems().stream().map(OrderItemViewDto::fromOrderItem).toList(),
                order.getPayment().getAmount(),
                order.getPayment().getPaymentMethod(),
                order.getPayment().getPaymentStatus(),
                order.getSpecialInstructions()
        );
    }
}
