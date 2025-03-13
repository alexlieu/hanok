package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.model.Product;
import com.alex_lieu.hanok.model.ProductVariant;

import java.math.BigDecimal;

public class ProductListMapper {
    public static ProductListDto toProductListDto(Product product) {
        return new ProductListDto(
                product.getId(),
                product.getName(),
                product.getVariations().stream().map(ProductVariant::getPrice).min(BigDecimal::compareTo).orElse(product.getBasePrice()),
                product.getCategory(),
                product.getImageUrl()
        );
    }
}
