package com.alex_lieu.hanok.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

@Configuration
public class MessageSourceConfig {

    @Bean
    public MessageSource messageSource() {
        // Reloadable means the messages can be reloaded without restarting the
        // application
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

        // Tells MessageSource where to find the message files
        // By default, Spring Boot doesn't include ValidationMessages.properties
        messageSource.setBasenames(
                "classpath:ValidationMessages",
                "classpath:messages");

        messageSource.setDefaultEncoding("UTF-8");

        // On first request, the messages are loaded from the properties file and loaded
        // into memory.
        // Subsequent requests will use the cached messages from memory.
        // Every hour, the MessageSource will check for updates to the properties file
        // and reload the messages into memory if they have changed.
        messageSource.setCacheSeconds(3600);

        // Use the message code as default message if not found
        messageSource.setUseCodeAsDefaultMessage(true);

        return messageSource;
    }
}
