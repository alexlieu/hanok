package com.alex_lieu.hanok.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long customerOrderId;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    private LocalDateTime orderDate;
    private double totalPrice;
    private String orderStatus;
    private String paymentMethod;
    private double orderAmount;

    @OneToMany(mappedBy = "customerOrder")
    private Set<OrderItem> orderItem;
}
