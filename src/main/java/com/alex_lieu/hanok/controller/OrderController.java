package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.OrderDto;
import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.Person;
import com.alex_lieu.hanok.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrders() {
        return ResponseEntity.ok( orderService.getOrders() );
    }
}
