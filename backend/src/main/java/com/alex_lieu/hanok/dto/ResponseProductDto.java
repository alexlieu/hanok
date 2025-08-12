package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.entity.ProductVariant;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for {@link com.alex_lieu.hanok.entity.Product}
 */
public record ResponseProductDto(
        long id,
        String name,
        String category,
        String imageUrl,
        ProductPriceRange priceRange
) implements Serializable {

    public record ProductPriceRange(
            BigDecimal min,
            BigDecimal max
    ) implements Serializable {}

    public static ResponseProductDto fromProduct(Product product) {
        List<BigDecimal> variantPrices = product.getVariations().stream()
                .map(ProductVariant::getPrice)
                .toList();

        BigDecimal min = variantPrices.stream()
                .min(BigDecimal::compareTo)
                .orElse(product.getBasePrice());

        BigDecimal max = variantPrices.stream()
                .max(BigDecimal::compareTo)
                .orElse(product.getBasePrice());

        return new ResponseProductDto(
                product.getId(),
                product.getName(),
                product.getCategory().getDisplayName(),
                product.getImageUrl(),
                new ProductPriceRange(min, max)
        );
    }
}