package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.basket.GetBasketResponseDto;
import com.alex_lieu.hanok.dto.order.OrderRequestDto;
import com.alex_lieu.hanok.dto.order.OrderSuccessDto;
import com.alex_lieu.hanok.exceptions.order.OrderPlacementFailedException;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.service.BasketService;
import com.alex_lieu.hanok.service.OrderProcessingService;
import com.alex_lieu.hanok.validation.billing_address.StateProvinceRegionLogic;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(StateProvinceRegionLogic.class);

    private final OrderProcessingService orderProcessingService;
    private final BasketService basketService;

    @Autowired
    public OrderController(OrderProcessingService orderProcessingService, BasketService basketService) {
        this.orderProcessingService = orderProcessingService;
        this.basketService = basketService;
    }

    @PostMapping(path = "/card-payment")
    private ResponseEntity<OrderSuccessDto> createOrderWithCardPayment(
            @RequestBody @Validated({ ValidationGroups.OrderChecks.class, ValidationGroups.PaymentChecks.class,
                    ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class,
                    ValidationGroups.FormatAndLogicChecks.class }) OrderRequestDto order)
            throws OrderPlacementFailedException, PaymentFailedException {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderProcessingService.processOrder(order));
    }

    @PostMapping(path = "/tokenized-payment")
    private ResponseEntity<OrderSuccessDto> createOrderWithTokenizedPayment(
            @RequestBody @Validated({ ValidationGroups.OrderChecks.class, ValidationGroups.PaymentChecks.class,
                    ValidationGroups.TokenChecks.class, ValidationGroups.PreConditionChecks.class,
                    ValidationGroups.FormatAndLogicChecks.class }) OrderRequestDto order)
            throws OrderPlacementFailedException, PaymentFailedException {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderProcessingService.processOrder(order));
    }

    @GetMapping(path = "/basket")
    private ResponseEntity<GetBasketResponseDto> getBasket(
            @RequestParam("itemIds") List<Long> itemIds,
            @RequestParam("quantities") List<Integer> quantities) {
        return ResponseEntity.ok(basketService.getBasket(itemIds, quantities));
    }
}
