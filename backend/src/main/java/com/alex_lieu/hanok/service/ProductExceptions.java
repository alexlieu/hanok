package com.alex_lieu.hanok.service;

public class ProductExceptions {
    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(long id) {
            super("Product with id " + id + " not found");
        }
        public ProductNotFoundException(String productName) { super("Product with name " + productName + " not found"); }
    }
    public static class ProductVariantNotFoundException extends RuntimeException {
        public ProductVariantNotFoundException(long id) {
            super("Product variant with id " + id + " not found");
        }
    }
}
