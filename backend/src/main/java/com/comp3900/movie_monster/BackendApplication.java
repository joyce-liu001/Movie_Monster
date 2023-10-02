package com.comp3900.movie_monster;

import com.comp3900.movie_monster.util.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class BackendApplication {
	@Autowired
	public BackendApplication(@Value("${spring.data.mongodb.uri}") String svnUrl) {
		System.out.println(svnUrl);
	}
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}


}
