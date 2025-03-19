package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.OrderCreateDto;
import com.alex_lieu.hanok.dto.OrderUpdateDto;
import com.alex_lieu.hanok.dto.OrderViewDto;
import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @GetMapping
    public ResponseEntity<List<OrderViewDto>> filterOrders(
            @RequestParam(value = "CID", required = false) Long customerId,
            @RequestParam(value = "OS", required = false) CustomerOrder.OrderStatus orderStatus,
            @RequestParam(value = "OTS", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime orderStart,
            @RequestParam(value = "OTE", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime orderEnd,
            @RequestParam(value = "PTS", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime pickupStart,
            @RequestParam(value = "PTE", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime pickupEnd,
            @RequestParam(value = "sortBy", defaultValue = "pt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
            ) {
        List<OrderViewDto> orderDtos = orderService.filterAll(customerId, orderStatus, orderStart, orderEnd, pickupStart, pickupEnd);
        return ResponseEntity.ok(orderDtos.stream().sorted(sortOrderComparator(sortBy, sortDir)).toList());
    }

    private Comparator<OrderViewDto> sortOrderComparator(String sortBy, String sortDir) {
        Comparator<OrderViewDto> comparator = switch (sortBy.toLowerCase()) {
            case "cid" -> Comparator.comparing(o -> o.customerDto().id());
            case "os" -> Comparator.comparing(OrderViewDto::orderStatus);
            case "pt" -> Comparator.comparing(OrderViewDto::pickupDateTime);
            case "ot" -> Comparator.comparing(OrderViewDto::orderDateTime);
            default -> throw new IllegalArgumentException( "Invalid sortBy parameter: " + sortBy.toLowerCase());
        };

        if (sortDir.equalsIgnoreCase("desc")) comparator = comparator.reversed();

        return comparator;
    }

    @PostMapping
    private ResponseEntity<OrderViewDto> placeOrder(@RequestBody OrderCreateDto order) {
        return ResponseEntity.ok(orderService.placeOrder(order));
    }

    @PatchMapping("/{id}")
    private ResponseEntity<OrderViewDto> updateOrder(@PathVariable long id, @RequestBody OrderUpdateDto updateDto) {
        return ResponseEntity.ok(orderService.updateOrder(id, updateDto));
    }

}
