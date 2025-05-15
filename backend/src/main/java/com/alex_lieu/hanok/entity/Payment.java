package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private CustomerOrder order;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDateTime;

    private String transactionReference;

    @PrePersist
    private void addPaymentDateTime() {
        this.paymentDateTime = LocalDateTime.now();
    }

    @PostPersist
    private void generateTransactionReference() {
        String base36id = Long.toString(this.id, 36).toUpperCase(Locale.ENGLISH);
        String paddedId = String.format("%7s", base36id).replace(' ', '0');
        setTransactionReference("RN-" + paddedId);
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Payment that = (Payment) o;
        return getId() != 0L && Objects.equals(this.getId(), that.getId());
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
