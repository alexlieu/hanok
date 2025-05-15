package com.alex_lieu.hanok.enums;

public enum PaymentMethod {
    CREDIT("Credit Card"),
    DEBIT("Debit Card"),
    CASH("Cash"),
    MOBILE("Mobile Payment"),
    APPLE("Apple Pay"),
    ANDROID("Android Pay"),
    PAYPAL("Paypal");
    
    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
