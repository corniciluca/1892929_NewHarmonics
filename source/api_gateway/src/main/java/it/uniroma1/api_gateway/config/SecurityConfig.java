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
import reactor.core.publisher.Flux; // Required for ReactiveJwtAuthenticationConverter
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
// Add other imports as needed (e.g., org.springframework.security.core.GrantedAuthority)

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtConfig jwtConfig;

    public SecurityConfig(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    // 1. Correctly decode the Base64 secret key
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        String rawSecret = jwtConfig.getSecret();
        // Use raw string bytes from application.properties
        byte[] keyBytes = rawSecret.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    // 2. Converter to extract authorities from the 'role' claim
    @Bean
    public ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role"); // Use 'role' claim
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // Prefix with "ROLE_"

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
                        // Spring Security now auto-discovers and uses the two bean converters above
                        .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
                )
                .authorizeExchange(exchange -> exchange
                        // Permit OPTIONS for CORS pre-flight
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🚨 CRUCIAL FIX: All /auth/** paths must be fully public 🚨
                        // This allows the request to be routed to the User Service
                        .pathMatchers("/auth/**").permitAll()

                        // Public routes (browsing)
                        .pathMatchers(HttpMethod.GET, "/songs/**").permitAll()

                        // Protected routes (ARTIST only)
                        .pathMatchers(HttpMethod.POST, "/songs/upload").hasRole("ARTIST")
                        .pathMatchers(HttpMethod.PUT, "/songs/**").hasRole("ARTIST")
                        .pathMatchers(HttpMethod.DELETE, "/songs/**").hasRole("ARTIST")

                        // All other requests require a valid JWT
                        .anyExchange().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // 🚨 Must include all origins (localhost:3000 for local, frontend:3000 for Docker)
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedOrigin("http://frontend:3000");

        // Allow necessary headers, including the Authorization header for JWT
        corsConfig.addAllowedHeader("*");
        // Allow all methods, crucial for the OPTIONS pre-flight request
        corsConfig.addAllowedMethod("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", corsConfig);

        // This explicit bean ensures CORS runs early in the filter chain.
        return new CorsWebFilter(source);
    }
}