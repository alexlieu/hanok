package com.alex_lieu.hanok.exceptions.product;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductUpdateFailedException extends RuntimeException {
    private String identifier;

    public ProductUpdateFailedException(String productId) {
        super("Failed to update product with identifer " + productId);
        this.identifier = productId;
    }

    public ProductUpdateFailedException(String productId, String message) {
        super(message);
        this.identifier = productId;
    }

    public ProductUpdateFailedException(String productId, String message, Throwable cause) {
        super(message, cause);
        this.identifier = productId;
    }
}
