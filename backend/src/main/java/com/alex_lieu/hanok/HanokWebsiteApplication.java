package com.alex_lieu.hanok;

import com.alex_lieu.hanok.config.StoreConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@EnableConfigurationProperties(StoreConfig.class)
public class HanokWebsiteApplication {

	@RequestMapping("/")
	public String home() {return "Hanok Website";}

	public static void main(String[] args) {
		SpringApplication.run(HanokWebsiteApplication.class, args);
	}

}
