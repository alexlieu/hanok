package com.alex_lieu.hanok.dto;

import com.alex_lieu.hanok.enums.Category;
import org.springframework.lang.Nullable;

public record CategoryWithCountDto(
        @Nullable Category category,
        String displayName,
        Long count
) {}
