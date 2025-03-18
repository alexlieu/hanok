package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.enums.Category;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link com.alex_lieu.hanok.entity.Product}
 */
public record ProductListDto(long id, String name, BigDecimal price, Category category, String imageUrl) implements Serializable {

}