package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private CustomerOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_id")
    private ProductVariation variation;

    private Integer quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;

    private String notes;

    public BigDecimal getSubTotal() {
        return unitPrice.multiply(new BigDecimal(quantity));
    }

}
