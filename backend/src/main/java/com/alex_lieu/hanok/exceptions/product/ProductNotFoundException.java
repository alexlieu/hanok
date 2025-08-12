package com.alex_lieu.hanok.exceptions.product;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductNotFoundException extends RuntimeException {

    private String identifier;

    public ProductNotFoundException(String productId) {
        super("Product with ID " + productId + " not found");
        this.identifier = productId;
    }

    public ProductNotFoundException(String productId, String message) {
        super(message);
        this.identifier = productId;
    }

    public ProductNotFoundException(String productId, String message, Throwable cause) {
        super(message, cause);
        this.identifier = productId;
    }
}
