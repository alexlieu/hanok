package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.ValidCardExpiration;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.Valid;
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
@ValidCardExpiration
public class CardDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "payment_id")
    @JsonBackReference
    private Payment payment;

    @NotBlank(message = "{card.lastFour.notBlank}")
    @Size(min = 4, max = 4, message = "{card.lastFour.size}")
    @Pattern(regexp = "^[0-9]+$", message = "{card.lastFour.digits}")
    private String lastFourDigits;

    @NotBlank(message = "{card.token.notBlank}")
    @Column(unique = true)
    @Size(min = 10, max = 200, message = "{card.token.size}")
    private String token;

    @NotBlank(message = "{card.expiry.month.notBlank}")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "{card.expiry.month.format}") // MM format (01-12)
    private String expiryMonth;

    @NotBlank(message = "{card.expiry.year.notBlank}")
    @Pattern(regexp = "^(202[5-9]|20[3-9][0-9]|2040)$", message = "{card.expiry.year.format}")
    private String expiryYear;

    @NotBlank(message = "{card.holderName.notBlank}")
    @Size(min = 2, max = 100, message = "{card.holderName.size}")
    @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{card.holderName.pattern}")
    private String holderName;

    @Valid
    @Embedded
    private BillingAddress billingAddress;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer()
                .getImplementationClass() : o.getClass();
        Class<?> thisEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getImplementationClass() : o.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        CardDetails that = (CardDetails) o;
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

