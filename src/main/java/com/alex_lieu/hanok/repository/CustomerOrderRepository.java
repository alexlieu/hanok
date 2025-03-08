package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.CustomerOrder;

import com.alex_lieu.hanok.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByCustomer(Person customer);
    List<CustomerOrder> findByOrderStatus(CustomerOrder.OrderStatus orderStatus);
    List<CustomerOrder> findByPickupDateTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
}