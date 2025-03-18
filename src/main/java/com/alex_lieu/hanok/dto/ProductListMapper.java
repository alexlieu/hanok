package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.entity.ProductVariant;

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
