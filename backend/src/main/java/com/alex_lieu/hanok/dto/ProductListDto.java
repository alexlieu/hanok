package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.entity.ProductVariant;
import com.alex_lieu.hanok.enums.Category;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for {@link com.alex_lieu.hanok.entity.Product}
 */
public record ProductListDto(
        long id,
        String name,
        Category category,
        String imageUrl,
        ProductPriceRange priceRange
) implements Serializable {

    public record ProductPriceRange(
            BigDecimal min,
            BigDecimal max
    ) implements Serializable {}

    public static ProductListDto fromProduct(Product product) {
        List<BigDecimal> variantPrices = product.getVariations().stream()
                .map(ProductVariant::getPrice)
                .toList();

        BigDecimal min = variantPrices.stream()
                .min(BigDecimal::compareTo)
                .orElse(product.getBasePrice());

        BigDecimal max = variantPrices.stream()
                .max(BigDecimal::compareTo)
                .orElse(product.getBasePrice());

        return new ProductListDto(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getImageUrl(),
                new ProductPriceRange(min, max)
        );
    }
}