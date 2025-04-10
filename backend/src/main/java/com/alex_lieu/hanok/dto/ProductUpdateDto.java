package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.enums.Category;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public record ProductUpdateDto(
        String name,
        String description,
        Category category,
        BigDecimal basePrice,
        String imageUrl,
        List<VariantUpdateDto> variants,
        Boolean active
) implements Serializable {
}
