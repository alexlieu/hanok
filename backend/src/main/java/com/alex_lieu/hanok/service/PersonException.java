package com.alex_lieu.hanok.service;

public class PersonException {
    public static class CustomerNotFoundException extends RuntimeException {
        public CustomerNotFoundException(long id) { super("Customer with id " + id + " not found"); }
    }
}
