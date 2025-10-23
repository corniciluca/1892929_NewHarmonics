package it.uniroma1.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        // Specifica l'origine del tuo frontend
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        corsConfig.setMaxAge(3600L); // Tempo in secondi per cui la risposta pre-flight può essere memorizzata nella cache
        corsConfig.addAllowedMethod("*"); // Permette tutti i metodi (GET, POST, PUT, etc.)
        corsConfig.addAllowedHeader("*"); // Permette tutti gli header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // Applica la configurazione a tutti i percorsi (/**)

        return new CorsWebFilter(source);
    }
}
