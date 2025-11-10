package it.uniroma1.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Flux;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtConfig jwtConfig;

    public SecurityConfig(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    // Correctly decode the Base64 secret key
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        String rawSecret = jwtConfig.getSecret();
        byte[] keyBytes = rawSecret.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    // Converter to extract authorities from the 'role' claim
    @Bean
    public ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        ReactiveJwtAuthenticationConverter reactiveConverter = new ReactiveJwtAuthenticationConverter();
        reactiveConverter.setJwtGrantedAuthoritiesConverter(
                jwt -> Flux.fromIterable(grantedAuthoritiesConverter.convert(jwt))
        );
        return reactiveConverter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
                )
                .authorizeExchange(exchange -> exchange
                        // Permit OPTIONS for CORS pre-flight
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public auth paths
                        .pathMatchers("/auth/**").permitAll()

                        // Public song browsing and searching
                        .pathMatchers(HttpMethod.GET, "/songs/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/songs/search/**").permitAll()

                        // Add the new file-update endpoint to the ARTIST rules
                        .pathMatchers(HttpMethod.POST, "/songs/upload").hasRole("ARTIST")
                        .pathMatchers(HttpMethod.POST, "/songs/{id}/update").hasRole("ARTIST") // <-- ADD THIS
                        
                        .pathMatchers(HttpMethod.OPTIONS, "/songs/{id}/like").permitAll()// <-- ADD THIS
                        .pathMatchers(HttpMethod.DELETE, "/songs/{id}/like").permitAll() // <-- ADD THIS

                        .pathMatchers(HttpMethod.PUT, "/songs/**").hasRole("ARTIST")
                        .pathMatchers(HttpMethod.DELETE, "/songs/**").hasRole("ARTIST")

                        // All other requests (e.g., /users, /feed, /notifications) require a valid JWT
                        .anyExchange().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedOrigin("http://frontend:3000");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");
        corsConfig.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsWebFilter(source);
    }
}