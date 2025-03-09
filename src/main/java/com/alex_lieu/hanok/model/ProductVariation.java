package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
public class ProductVariation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private Flavour flavour;

    @Enumerated(EnumType.STRING)
    private Size size;

    public enum Size { REGULAR, LARGE }

    public enum Flavour { PLAIN, MUGWORT }

}
