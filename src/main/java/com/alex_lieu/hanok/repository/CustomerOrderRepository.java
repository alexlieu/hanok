package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.CustomerOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    Page<CustomerOrder> findOrderItemsByCustomerId(long id, Pageable pageable);
}