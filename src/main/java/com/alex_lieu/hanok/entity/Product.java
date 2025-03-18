package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.enums.Category;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table(
        indexes = {
                @Index(name = "idx_category_active", columnList = "category, active"),
                @Index(name = "idx_name_active", columnList = "name, active"),
                @Index(name = "idx_name_category", columnList = "name, category")
        }
)
public class Product {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @Column(unique=true)
    @NotNull(message = "{product.name.notblank}")
    @Size(min = 3, max = 50, message = "{product.name.size}")
    private String name;

    @Column(length = 1000)
    private String description = "";

    @Enumerated(EnumType.STRING)
    @NotNull(message = "{product.category.notblank}")
    private Category category;

    @NotNull(message = "{product.basePrice.notblank}")
    @Min(value = 0, message = "{product.basePrice.min}")
    private BigDecimal basePrice;

    @Column(unique = true, nullable = true)
    private String imageUrl;

    @Column(columnDefinition = "boolean default true")
    private Boolean active = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Serializes this side normally.
    @NotNull(message = "{product.variant.notblank}")
    @ToString.Exclude
    private List<ProductVariant> variations = new ArrayList<>();

    public void addVariant(ProductVariant productVariant) {
        variations.add(productVariant);
        productVariant.setProduct(this);
    }

    /**
     * Adds a ProductVariation object with default values to a Product with no variation options.
     */
    public void createDefaultProduct() {
        ProductVariant defaultVar = new ProductVariant();
        defaultVar.setSize(ProductVariant.Size.REGULAR);
        defaultVar.setFlavour(ProductVariant.Flavour.PLAIN);
        defaultVar.setPrice(this.basePrice);
        defaultVar.setActive(true);
        this.addVariant(defaultVar);
    }

    public void attachVariants(List<ProductVariant> variants) {
        this.variations.addAll(variants);
        for (ProductVariant variant : variants) {
            variant.setProduct(this);
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
