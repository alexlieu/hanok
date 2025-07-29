package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.enums.PaymentMethod;
import com.alex_lieu.hanok.validation.ValidPaymentDetails;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
@ValidPaymentDetails
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private CustomerOrder order;

    @NotNull(message = "payment.total.notNull")
    @Positive(message = "payment.total.positive")
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "payment.method.notNull")
    private PaymentMethod paymentMethod;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "card_details_id", referencedColumnName = "id")
    @JsonManagedReference
    @Valid
    @ToString.Exclude
    private CardDetails cardDetails;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JoinColumn(name = "tokenized_payment_details_id", referencedColumnName = "id")
    @Valid
    @ToString.Exclude
    private TokenizedPaymentDetails tokenizedPaymentDetails;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDateTime;

    @NotBlank(message = "payment.transactionalRef.notBlank")
    @Size(min = 10, max = 50, message = "payment.transactionalRef.size")
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
