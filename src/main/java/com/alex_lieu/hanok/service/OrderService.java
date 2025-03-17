package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.OrderDto;
import com.alex_lieu.hanok.dto.OrderItemDto;
import com.alex_lieu.hanok.dto.PersonMapper;
import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.OrderItem;
import com.alex_lieu.hanok.model.Person;
import com.alex_lieu.hanok.model.ProductVariant;
import com.alex_lieu.hanok.repository.CustomerOrderRepository;
import com.alex_lieu.hanok.repository.OrderItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class OrderService {
    private final CustomerOrderRepository customerOrderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(CustomerOrderRepository customerOrderRepository, OrderItemRepository orderItemRepository) {
        this.customerOrderRepository = customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * What functionality do we want here?
     *  - To view all order belonging to a customer.
     *    - Params: customerDTO
     *  - To view an order with all the order items listed.
     *    - Params: orderDTO (which should have an orderItemListDTO as a parameter)
     *  - To create an order.
     *    - Params: orderItemListDTO, customerDto, specialInstructions, paymentDTO?
     *      - Unit price should default to the price of the product item.
     *  - To update an order (functionality for staff members only)
     *    - Params: orderDTO & updateOrderDTO (this should include only pickupDateTime, orderStatus)
     */

    public CustomerOrder getOrderById(long id) {
        return customerOrderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public List<OrderDto> getOrders() {
        return customerOrderRepository.findAll().stream().map(
                order -> createOrderDto(order, order.getCustomer())
        ).toList();
    }

    public OrderDto createOrderDto(CustomerOrder customerOrder, Person person) {
        return new OrderDto(
                customerOrder.getId(),
                customerOrder.getPickupDateTime(),
                customerOrder.getOrderStatus(),
                customerOrder.getSpecialInstructions(),
                customerOrder.getOrderItems().stream().map(this::createOrderItemDto).toList(),
                PersonMapper.toPersonDto(person)
        );
    }

    public OrderItemDto createOrderItemDto(OrderItem orderItem) {
        ProductVariant variant = orderItem.getVariant();
        List<String> itemName = Arrays.asList(variant.getProduct().getName(), variant.getFlavour().name(), variant.getSize().name());
        return new OrderItemDto(
                orderItem.getId(),
                itemName,
                orderItem.getQuantity(),
                orderItem.getNotes()
        );
    }

    public List<CustomerOrder> getOrderItemsForOrder(long id) {
        CustomerOrder customerOrder = getOrderById(id);
        return customerOrderRepository.findOrderItemsByCustomerId(id);
    }

    @Transactional
    public void placeOrder(CustomerOrder order, List<OrderItem> orderItem) {
        try {
            order.setOrderStatus(CustomerOrder.OrderStatus.PENDING);
            CustomerOrder customerOrder = customerOrderRepository.save(order);
            for (OrderItem item : orderItem) {
                item.setOrder(customerOrder);
                orderItemRepository.save(item);
            }
        } catch (DataAccessException e) {
            throw new OrderExceptions.OrderProcessingException("Error saving order or order items", e);
        } catch (Exception e) {
            throw new OrderExceptions.UnexpectedOrderException("Unexpected error during order placement", e);
        }
    }

}
