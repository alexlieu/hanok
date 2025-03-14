package com.alex_lieu.hanok.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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

    private BigDecimal price;

    @Column(columnDefinition = "boolean default true")
    private boolean available;

    @Enumerated(EnumType.STRING)
    private Flavour flavour;

    @Enumerated(EnumType.STRING)
    private Size size;

    @Column(columnDefinition = "boolean default true")
    private Boolean active;

    public enum Size { REGULAR, LARGE }

    public enum Flavour { PLAIN, MUGWORT }

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
