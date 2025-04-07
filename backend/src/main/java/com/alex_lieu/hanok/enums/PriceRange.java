package com.alex_lieu.hanok.enums;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.Arrays;

@Getter
public enum PriceRange {
    RANGE_0(0, 10),
    RANGE_1(10, 15),
    RANGE_2(15, 20),
    RANGE_3(20, null);

    private final BigDecimal min;
    private final BigDecimal max;

    PriceRange(int min, Integer max) {
        this.min = BigDecimal.valueOf(min);
        this.max = max != null ? BigDecimal.valueOf(max) : null;
    }

    public static PriceRange fromString(String input) {
        if (input == null) return null;

        String normalizedInput = input.toUpperCase().trim().replace("-", "_");
        if (normalizedInput.matches("\\d+")) {
            int index = Integer.parseInt(normalizedInput);
            return Arrays.stream(values())
                    .filter(range -> range.ordinal() == index)
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid price range index: " + input));
        } else {
            return Arrays.stream(values())
                    .filter(range -> range.name().equalsIgnoreCase(normalizedInput))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid price range name: " + input));
        }
    }
}
