package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.model.Person;

public class PersonMapper {
    public static PersonDto toPersonDto(Person person) {
        return new PersonDto(
                person.getId(),
                person.getFirstName(),
                person.getLastName(),
                person.getEmail(),
                person.getPhoneNumber()
        );
    }
}
