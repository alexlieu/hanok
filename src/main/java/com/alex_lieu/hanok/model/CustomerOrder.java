package com.alex_lieu.hanok.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Person customer;

    //This tag doesn't work for some reason.
    //@FutureOrPresent(message = "{order.order.future}")
    private LocalDateTime orderDateTime;

    @Future(message = "{order.pickup.future}")
    private LocalDateTime pickupDateTime;

    private LocalDateTime updatedAt;

    // Called before the entity is persisted (inserted into the database)
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.orderDateTime = now;
        this.updatedAt = now;
    }

    // Called before the entity is updated
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private String specialInstructions;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<OrderItem> orderItems = new ArrayList<>();

    public BigDecimal getTotal() {
        return orderItems.stream().map(OrderItem::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public enum OrderStatus { PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED }

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
