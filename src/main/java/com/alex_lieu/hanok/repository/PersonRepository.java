package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.Person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Person findByEmail(String email);
    Page<Person> findByPhoneNumber(String phoneNumber, Pageable pageable);
}