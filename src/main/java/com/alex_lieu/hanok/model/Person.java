package com.alex_lieu.hanok.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
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
    private List<CustomerOrder> orders;

    public enum Role { CUSTOMER, STAFF, ADMIN }

}
