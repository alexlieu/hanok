package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.model.Person;

public class PersonMapper {
    public static CustomerDto toPersonDto(Person person) {
        return new CustomerDto(
                person.getId(),
                person.getFirstName(),
                person.getLastName(),
                person.getEmail(),
                person.getPhoneNumber()
        );
    }
}
