package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.OrderItem;
import com.alex_lieu.hanok.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Page<OrderItem> findByOrder(CustomerOrder order, Pageable pageable);
}