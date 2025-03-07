package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Category category;

    private BigDecimal price;

    private String imageUrl;

    private Boolean available = true;

    @OneToMany(mappedBy = "product")
    private Set<OrderItem> orderItems;

    @Getter
    public enum Category {
        RICE_CAKE("Rice Cakes"),
        YAKGWA("Yakgwa"),
        CASTELLA("Castellas"),
        MADELEINE("Madeleines"),
        BROWNIE("Brownies"),
        CAKE("Cakes"),
        SERVICE("Services");

        private final String displayName;

        Category(String displayName) {
            this.displayName = displayName;
        }
    }

}
