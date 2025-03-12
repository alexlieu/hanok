package com.alex_lieu.hanok.enums;

import lombok.Getter;

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
}
