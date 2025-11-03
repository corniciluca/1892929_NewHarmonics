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
                    // Public GET routes
                    .requestMatchers(HttpMethod.GET, "/songs/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/songs").permitAll()


                    // Rules for "liking" songs
                    // Allow any authenticated user (LISTENER or ARTIST)
                    .requestMatchers(HttpMethod.POST, "/songs/{id}/like").authenticated() 
                    .requestMatchers(HttpMethod.DELETE, "/songs/{id}/like").authenticated() 

                    // Rules for "uploading/editing" songs
                    // Must be an ARTIST
                    .requestMatchers(HttpMethod.POST, "/songs/upload").hasRole("ARTIST")
                    .requestMatchers(HttpMethod.POST, "/songs").hasRole("ARTIST") 
                    .requestMatchers(HttpMethod.PUT, "/songs/**").hasRole("ARTIST")
                    .requestMatchers(HttpMethod.DELETE, "/songs/**").hasRole("ARTIST")

                    .anyRequest().authenticated()
                );

        return http.build();
    }
}
