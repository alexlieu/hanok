package com.alex_lieu.hanok.service;

public class PaymentExceptions {
    public static class OrderPlacementFailedException extends RuntimeException {
        public OrderPlacementFailedException(String message, Throwable cause) {
            super(message, cause);
        }
    }

}
