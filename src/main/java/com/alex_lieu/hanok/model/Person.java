package com.alex_lieu.hanok.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long personId;

    private String username;
    private String passwordHash;
    private String phoneNumber;
    private String email;
    private String address;
    private String role;

    @OneToMany(mappedBy = "person")
    private Set<CustomerOrder> orders;

}
