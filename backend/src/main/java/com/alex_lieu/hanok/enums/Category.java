package com.alex_lieu.hanok.enums;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Category {
    RICE_CAKE("Rice Cakes"),
    YAKGWA("Yakgwa"),
    CASTELLA("Castellas"),
    MADELEINE("Madeleines"),
    BROWNIE("Brownies"),
    CAKE("Cakes"),
    SERVICE("Services");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public static Category fromString(String input) {
        if (input == null) return null;
        String normalizedInput = input.trim().replace("-","_");
        return Arrays.stream(values())
                .filter(c -> c.name().equalsIgnoreCase(normalizedInput) ||
                        c.displayName.equalsIgnoreCase(normalizedInput.replace("_"," ")))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid category: " + input));
    }
}
