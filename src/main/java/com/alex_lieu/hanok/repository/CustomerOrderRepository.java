package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.CustomerOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findOrderItemsByCustomerId(long id);
}