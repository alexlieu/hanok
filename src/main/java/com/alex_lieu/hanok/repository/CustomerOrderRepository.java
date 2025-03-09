package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.Person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    Page<CustomerOrder> findByCustomerId(Long id, Pageable pageable);
    Page<CustomerOrder> findByOrderStatus(CustomerOrder.OrderStatus orderStatus, Pageable pageable);
    Page<CustomerOrder> findByPickupDateTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);
}