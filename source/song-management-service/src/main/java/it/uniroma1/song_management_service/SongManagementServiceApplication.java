package it.uniroma1.song_management_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication
@EnableElasticsearchRepositories(basePackages = "it.uniroma1.song_management_service.repository")
public class SongManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SongManagementServiceApplication.class, args);
	}

}
