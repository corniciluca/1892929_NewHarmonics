package it.uniroma1.song_management_service.config;

import it.uniroma1.song_management_service.filter.RoleHeaderFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RoleHeaderFilter roleHeaderFilter;

    // Inject the custom filter
    public SecurityConfig(RoleHeaderFilter roleHeaderFilter) {
        this.roleHeaderFilter = roleHeaderFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(roleHeaderFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth

                        // Public Routes (Browsing)
                        .requestMatchers(HttpMethod.GET, "/songs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/songs").permitAll()

                        // 🚨 The FIX: Use hasAuthority("ROLE_ARTIST") 🚨
                        // Now explicitly checks for the authority string created in the filter.
                        .requestMatchers(HttpMethod.POST, "/songs/**").hasRole("ARTIST")
                        .requestMatchers(HttpMethod.PUT, "/songs/**").hasRole("ARTIST")
                        .requestMatchers(HttpMethod.DELETE, "/songs/**").hasRole("ARTIST")

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
