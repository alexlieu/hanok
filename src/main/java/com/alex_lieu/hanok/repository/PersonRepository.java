package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.Person;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Person findByEmail(String email);
    Person findByPhoneNumber(String phoneNumber);
}