package com.alex_lieu.hanok.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long productId;

    private String name;
    private String description;
    private double price;
    private String imageUrl;

    @OneToMany(mappedBy = "product")
    private Set<OrderItem> orderItems;

}
