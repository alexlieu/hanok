package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.enums.PaymentMethod;
import com.alex_lieu.hanok.validation.groups.FirstValidationGroup;
import com.alex_lieu.hanok.validation.groups.SecondValidationGroup;
import com.alex_lieu.hanok.validation.payment.ValidPaymentDetails;
import jakarta.persistence.*;
import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;
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
    public interface CardPayment {
    }

    public interface TokenizedPayment {
    }

    @GroupSequence({Default.class, Payment.CardPayment.class, FirstValidationGroup.class, SecondValidationGroup.class})
    public interface FullCardValidationSequence {
    }

    @GroupSequence({Default.class, Payment.TokenizedPayment.class, FirstValidationGroup.class, SecondValidationGroup.class})
    public interface FullTokenizedValidationSequence {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private CustomerOrder order;

    @NotNull(message = "payment.total.notNull", groups = {FirstValidationGroup.class})
    @Positive(message = "payment.total.positive", groups = {SecondValidationGroup.class})
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "payment.method.notNull")
    private PaymentMethod paymentMethod;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "token", column = @Column(name = "cardToken")),
            @AttributeOverride(name = "lastFour", column = @Column(name = "cardLastFour")),
    })
    private CardDetails cardDetails;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "token", column = @Column(name = "tokenizedToken")),
            @AttributeOverride(name = "lastFour", column = @Column(name = "tokenizedLastFour")),
    })
    private TokenizedPaymentDetails tokenizedPaymentDetails;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDateTime;

    @NotBlank(message = "payment.transactionalRef.notBlank", groups = {FirstValidationGroup.class})
    @Size(min = 10, max = 50, message = "payment.transactionalRef.size", groups = {SecondValidationGroup.class})
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
