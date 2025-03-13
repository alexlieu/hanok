package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.OrderItem;
import com.alex_lieu.hanok.model.Person;
import com.alex_lieu.hanok.repository.CustomerOrderRepository;
import com.alex_lieu.hanok.repository.OrderItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final CustomerOrderRepository customerOrderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(CustomerOrderRepository customerOrderRepository, OrderItemRepository orderItemRepository) {
        this.customerOrderRepository = customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public CustomerOrder getOrderById(long id) {
        return customerOrderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public Page<CustomerOrder> getOrders(Person currentUser, Pageable pageable) {
        if (currentUser.getRole() == Person.Role.STAFF) {
            return customerOrderRepository.findAll(pageable);
        } else {
            return customerOrderRepository.findOrderItemsByCustomerId(currentUser.getId(), pageable);
        }
    }

    public Page<CustomerOrder> getOrderItemsForOrder(long id, Pageable pageable) {
        CustomerOrder customerOrder = getOrderById(id);
        return customerOrderRepository.findOrderItemsByCustomerId(id, pageable);
    }

    @Transactional
    public void updateOrderStatus(long orderId, CustomerOrder.OrderStatus status) {
        CustomerOrder order = getOrderById(orderId);
        order.setOrderStatus(status);
        customerOrderRepository.save(order);
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
