package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Person customer;

    private LocalDateTime orderDateTime;
    private LocalDateTime pickupDateTime;
    private OrderStatus orderStatus;

    private String specialInstructions;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public BigDecimal getTotal() {
        return orderItems.stream().map(OrderItem::getSubTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public enum OrderStatus { PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED }

}
