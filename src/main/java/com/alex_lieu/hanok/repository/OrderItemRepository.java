package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.OrderItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long id);
    List<OrderItem> findByVariantId(Long id);
}