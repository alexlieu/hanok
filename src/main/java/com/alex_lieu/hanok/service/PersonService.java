package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.entity.Person;
import com.alex_lieu.hanok.repository.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person findById(long id) {
        return personRepository.findById(id).orElseThrow(() -> new PersonException.CustomerNotFoundException(id));
    }
}
