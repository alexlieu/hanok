package com.alex_lieu.hanok.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long paymentId;

    @OneToOne
    @JoinColumn(name = "customer_order_id")
    private CustomerOrder customerOrder;

    private long transactionId;
    private String paymentStatus;
    private LocalDateTime paymentDate;
}
