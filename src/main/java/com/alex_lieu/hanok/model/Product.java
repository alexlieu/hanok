package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
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

    private BigDecimal basePrice;

    private String imageUrl;

    private Boolean available = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariation> variations;

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

    /**
     * Adds a ProductVariation object with default values to a Product with no variation options.
     */
    public void createDefaultProduct() {
        if (this.variations.isEmpty()) {
            ProductVariation defaultVar = new ProductVariation();
            defaultVar.setSize(ProductVariation.Size.REGULAR);
            defaultVar.setFlavour(ProductVariation.Flavour.PLAIN);
            defaultVar.setPrice(this.basePrice);
            this.variations.add(defaultVar);
        }
    }
}
