package com.alex_lieu.hanok.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    CARD("card"),
    CASH("Cash"),
    MOBILE("Mobile Payment"),
    APPLE("Apple Pay"),
    PAYPAL("Paypal"),
    GOOGLE("Google Pay");
    
    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

}
