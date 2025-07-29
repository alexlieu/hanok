package com.alex_lieu.hanok.exceptions;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomerNotFoundException extends RuntimeException {

    private String customerId;

    public CustomerNotFoundException(String customerId) {
        super("Customer with ID " + customerId + " not found");
        this.customerId = customerId;
    }

    public CustomerNotFoundException(String customerId, String message) {
        super(message);
        this.customerId = customerId;
    }

    public CustomerNotFoundException(String customerId, String message, Throwable cause) {
        super(message, cause);
        this.customerId = customerId;
    }
}
