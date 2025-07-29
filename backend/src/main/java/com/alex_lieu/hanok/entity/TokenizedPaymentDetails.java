package com.alex_lieu.hanok.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
public class TokenizedPaymentDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "payment_id")
    @JsonBackReference
    private Payment payment;

    @NotBlank(message = "tokenized.payment.token.notBlank")
    @Size(min = 10, max = 100, message = "tokenized.payment.token.size")
    @Column(unique = true, nullable = false)
    private String token;

    @Size(min = 4, max = 4, message = "tokenized.payment.lastFour.size")
    @Pattern(regexp = "^[0-9]+$", message = "tokenized.payment.lastFour.digits")
    private String lastFour;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer()
                .getImplementationClass() : o.getClass();
        Class<?> thisEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getImplementationClass() : o.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        TokenizedPaymentDetails that = (TokenizedPaymentDetails) o;
        return getId() != 0L && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        if (getId() != 0L) {
            return Objects.hash(getId());
        }
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getImplementationClass().hashCode() : this.getClass().hashCode();
    }
}
