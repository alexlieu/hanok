package com.alex_lieu.hanok.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.Objects;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_variant_product_constraints", columnNames = {"product_id","flavour","size"})
        },
        indexes = {
                @Index(name = "idx_product_variant_price", columnList = "price"),
                @Index(name = "idx_product_variant_available", columnList = "available")
        }
)
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference // Omits this side from serialization.
    private Product product;

    @NotNull(message = "{variant.price.notblank}")
    @Min(value = 0, message = "{variant.price.min}")
    private BigDecimal price;

    @Column(columnDefinition = "boolean default true")
    private boolean available;

    @NotNull(message = "{variant.flavour.notblank}")
    @Enumerated(EnumType.STRING)
    private Flavour flavour;

    @NotNull(message = "{variant.size.notblank}")
    @Enumerated(EnumType.STRING)
    private Size size;

    @Column(columnDefinition = "boolean default true")
    private Boolean active = true;

    public enum Size { REGULAR, LARGE }

    public enum Flavour { PLAIN, MUGWORT, MATCHA, CHOCOLATE }

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
