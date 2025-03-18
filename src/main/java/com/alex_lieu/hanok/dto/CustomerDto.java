package com.alex_lieu.hanok.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link com.alex_lieu.hanok.entity.Person}
 */
public record CustomerDto(
        long id,
        @NotNull String firstName,
        @NotNull String lastName,
        @NotNull String phoneNumber,
        @Email String email
        // Email and Phone Number verification.
) implements Serializable {}