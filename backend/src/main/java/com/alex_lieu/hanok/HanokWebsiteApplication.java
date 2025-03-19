package com.alex_lieu.hanok;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class HanokWebsiteApplication {

	@RequestMapping("/")
	public String home() {return "Hanok Website";}

	public static void main(String[] args) {
		SpringApplication.run(HanokWebsiteApplication.class, args);
	}

}
