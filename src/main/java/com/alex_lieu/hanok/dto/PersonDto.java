package com.alex_lieu.hanok.dto;

import java.io.Serializable;

/**
 * DTO for {@link com.alex_lieu.hanok.model.Person}
 */
public record PersonDto(long id, String firstName, String lastName, String phoneNumber,
                        String email) implements Serializable {
}