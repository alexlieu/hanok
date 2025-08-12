package com.alex_lieu.hanok.exceptions.product;

public class ProductCreateFailedException extends RuntimeException {
    public ProductCreateFailedException(String message) {
        super(message);
    }

    public ProductCreateFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
