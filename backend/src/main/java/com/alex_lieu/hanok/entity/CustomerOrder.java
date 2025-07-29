package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.AtLeastOneRequired;
import com.alex_lieu.hanok.validation.ContactNumberConstraint;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@AtLeastOneRequired(fields = {"email", "phoneNumber"}, message = "{customer.contact.required}")
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Person customer;

    @NotBlank(message = "{customer.name.notblank}")
    private String customerName;

    @Email(message = "{email.valid}")
    @Column(name = "email")
    private String email;

    @ContactNumberConstraint
    @Column(name = "phone_number")
    private String phoneNumber;

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
        this.orderStatus = OrderStatus.PENDING;
    }

    @PostPersist
    public void generateOrderNumber() {
        String base36id = Long.toString(this.id, 36).toUpperCase(Locale.ENGLISH);
        String paddedId = String.format("%7s", base36id).replace(' ', '0');
        setOrderNumber("ORD-" + paddedId);
    }

    // Called before the entity is updated
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Size(max = 500, message = "order.specialInstructions.size")
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
        CustomerOrder that = (CustomerOrder) o;
        return getId() != 0L && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        if (getId() != 0L) {
            return Objects.hash(getId());
        }
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getPersistentClass().hashCode() : this.getClass().hashCode();
    }

}
