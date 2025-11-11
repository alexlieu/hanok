package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.entity.OrderItem;
import com.alex_lieu.hanok.entity.Payment;
import com.alex_lieu.hanok.entity.ProductVariant;
import com.alex_lieu.hanok.enums.PaymentMethod;
import com.alex_lieu.hanok.enums.PickupSlot;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderSuccessDto(
        CustomerOrder.OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        String maskedCardNo,
        List<OrderItemDetails> orderItems,
        BigDecimal total,
        String specialInstructions,
        String customerName,
        String email,
        String phoneNumber,
        LocalDate pickupDateTime,
        PickupSlot pickupSlot,
        ZonedDateTime orderDateTime
) implements Serializable {
    private record OrderItemDetails(
            String productName,
            VariantConfig variantConfig,
            BigDecimal unitPrice,
            Integer quantity,
            BigDecimal itemTotal
    ) {
        private record VariantConfig(
                ProductVariant.Size size,
                ProductVariant.Flavour flavour
        ) {
        }

        public static OrderItemDetails fromOrderItemEntity(OrderItem orderItem) {
            ProductVariant variant = orderItem.getVariant();
            return new OrderItemDetails(
                    variant.getProduct().getName(),
                    new VariantConfig(
                            variant.getSize(),
                            variant.getFlavour()
                    ),
                    orderItem.getUnitPrice(),
                    orderItem.getQuantity(),
                    orderItem.getSubtotal()
            );
        }
    }

    public static OrderSuccessDto fromEntity(CustomerOrder order) {
        Payment payment = order.getPayment();

        String maskedCardNo = null;
        if (payment.getCardDetails() != null) {
            maskedCardNo = "**** **** **** " + payment.getCardDetails().getLastFour();
        }

        return new OrderSuccessDto(
                order.getOrderStatus(),
                payment.getPaymentMethod(),
                maskedCardNo,
                order.getOrderItems().stream().map(OrderItemDetails::fromOrderItemEntity)
                        .collect(Collectors.toList()),
                order.getTotal(),
                order.getSpecialInstructions(),
                order.getCustomerName(),
                order.getEmail(),
                order.getPhoneNumber(),
                order.getPickupDate(),
                order.getPickupSlot(),
                order.getOrderDateTime()
        );
    }
}
