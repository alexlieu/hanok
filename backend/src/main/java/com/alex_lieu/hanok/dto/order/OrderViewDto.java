package com.alex_lieu.hanok.dto.order;

import com.alex_lieu.hanok.dto.CustomerDto;
import com.alex_lieu.hanok.dto.PersonMapper;
import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.entity.Person;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link com.alex_lieu.hanok.entity.CustomerOrder}
 */
public record OrderViewDto(
        @NotNull(message = "{order.id.notblank}") long id,
        LocalDateTime orderDateTime,
        LocalDateTime pickupDateTime,
        @NotNull(message = "{order.status.notblank}") CustomerOrder.OrderStatus orderStatus,
        @Positive(message = "{order.total.positive}") BigDecimal totalPrice,
        String specialInstructions,
        @NotEmpty(message = "{order.items.notempty}") List<OrderItemViewDto> orderItemDtos,
        @NotNull CustomerDto customerDto
) implements Serializable {
    public static OrderViewDto fromOrder(CustomerOrder order, Person customer) {
        return new OrderViewDto(
                order.getId(),
                order.getOrderDateTime(),
                order.getPickupDateTime(),
                order.getOrderStatus(),
                order.getTotal(),
                order.getSpecialInstructions(),
                order.getOrderItems().stream().map(OrderItemViewDto::fromOrderItem).toList(),
                PersonMapper.toPersonDto(customer)
        );
    }
}
