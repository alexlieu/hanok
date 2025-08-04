package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.order.OrderRequestDto;
import com.alex_lieu.hanok.dto.order.OrderSuccessDto;
import com.alex_lieu.hanok.exceptions.order.OrderPlacementFailedException;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.service.OrderProcessingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173/")
public class OrderController {
    private final OrderProcessingService orderProcessingService;

    @Autowired
    public OrderController(OrderProcessingService orderProcessingService) {
        this.orderProcessingService = orderProcessingService;
    }

    @PostMapping
    private ResponseEntity<OrderSuccessDto> createOrder(@Valid @RequestBody OrderRequestDto order) throws OrderPlacementFailedException, PaymentFailedException {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderProcessingService.processOrder(order));
    }

//    @GetMapping
//    public ResponseEntity<List<OrderViewDto>> filterOrders(
//            @RequestParam(value = "CID", required = false) Long customerId,
//            @RequestParam(value = "OS", required = false) CustomerOrder.OrderStatus orderStatus,
//            @RequestParam(value = "OTS", required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
//            LocalDateTime orderStart,
//            @RequestParam(value = "OTE", required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
//            LocalDateTime orderEnd,
//            @RequestParam(value = "PTS", required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
//            LocalDateTime pickupStart,
//            @RequestParam(value = "PTE", required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
//            LocalDateTime pickupEnd,
//            @RequestParam(value = "sortBy", defaultValue = "pt", required = false) String sortBy,
//            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
//            ) {
//        List<OrderViewDto> orderDtos = orderService.filterAll(customerId, orderStatus, orderStart, orderEnd, pickupStart, pickupEnd);
//        return ResponseEntity.ok(orderDtos.stream().sorted(sortOrderComparator(sortBy, sortDir)).toList());
//    }

//    private Comparator<OrderViewDto> sortOrderComparator(String sortBy, String sortDir) {
//        Comparator<OrderViewDto> comparator = switch (sortBy.toLowerCase()) {
//            case "cid" -> Comparator.comparing(o -> o.customerDto().id());
//            case "os" -> Comparator.comparing(OrderViewDto::orderStatus);
//            case "pt" -> Comparator.comparing(OrderViewDto::pickupDate);
//            case "ot" -> Comparator.comparing(OrderViewDto::orderDateTime);
//            default -> throw new IllegalArgumentException( "Invalid sortBy parameter: " + sortBy.toLowerCase());
//        };
//
//        if (sortDir.equalsIgnoreCase("desc")) comparator = comparator.reversed();
//
//        return comparator;
//    }
//
//    @GetMapping(path = "/basket")
//    private ResponseEntity<BasketResponseDto> getBasket(
//            @RequestParam("itemIds") List<Long> itemIds,
//            @RequestParam("quantities") List<Integer> quantities
//    ) {
//        return ResponseEntity.ok(orderService.getBasket(itemIds, quantities));
//    }

//    @PostMapping
//    private ResponseEntity<?> placeOrder(@Valid @RequestBody OrderCreateDto order) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(order));
//    }


//
//    @PatchMapping("/{id}")
//    private ResponseEntity<OrderViewDto> updateOrder(@PathVariable long id, @RequestBody OrderUpdateDto updateDto) {
//        return ResponseEntity.ok(orderService.updateOrder(id, updateDto));
//    }

}
