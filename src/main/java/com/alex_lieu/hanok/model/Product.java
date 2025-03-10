package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductVariant> variations;

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
            ProductVariant defaultVar = new ProductVariant();
            defaultVar.setSize(ProductVariant.Size.REGULAR);
            defaultVar.setFlavour(ProductVariant.Flavour.PLAIN);
            defaultVar.setPrice(this.basePrice);
            this.variations.add(defaultVar);
        }
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Product product = (Product) o;
        Long id = this.getId();
        return id != null && Objects.equals(getId(), product.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

}
