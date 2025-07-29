package com.alex_lieu.hanok.exceptions.product;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductVariantNotFoundException extends RuntimeException {

    private String productVariantId;

    public ProductVariantNotFoundException(String productVariantId) {
        super("Product with ID " + productVariantId + " not found");
        this.productVariantId = productVariantId;
    }

    public ProductVariantNotFoundException(String productVariantId, String message) {
        super(message);
        this.productVariantId = productVariantId;
    }

    public ProductVariantNotFoundException(String productVariantId, String message, Throwable cause) {
        super(message, cause);
        this.productVariantId = productVariantId;
    }
}

