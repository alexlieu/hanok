package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.enums.Category;

public record CategoryCountDto(
        Category category,
        String displayName,
        Long count
) {}
