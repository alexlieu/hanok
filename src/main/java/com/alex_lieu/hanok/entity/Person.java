package com.alex_lieu.hanok.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.List;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    @Column(unique = true)
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "customer")
    @ToString.Exclude
    private List<CustomerOrder> orders;

    public enum Role { CUSTOMER, STAFF, ADMIN }

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
