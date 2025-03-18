package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.Person;

public class PersonMapper {
    public static CustomerDto toPersonDto(Person person) {
        return new CustomerDto(
                person.getId(),
                person.getFirstName(),
                person.getLastName(),
                person.getPhoneNumber(),
                person.getEmail()
        );
    }
}
