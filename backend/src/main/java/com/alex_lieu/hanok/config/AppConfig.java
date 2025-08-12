package com.alex_lieu.hanok.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Value("${phone.default-country-code:GB}")
    private String defaultCountryCode;

    @Bean
    public String defaultCountryCode() {
        return defaultCountryCode;
    }
}
