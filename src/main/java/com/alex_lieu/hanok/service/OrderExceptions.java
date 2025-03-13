package com.alex_lieu.hanok.service;

public class OrderExceptions {
    public static class OrderProcessingException extends RuntimeException {
        public OrderProcessingException(String message, Throwable cause) {
            super(message);
        }
    }
    public static class UnexpectedOrderException extends RuntimeException {
        public UnexpectedOrderException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
