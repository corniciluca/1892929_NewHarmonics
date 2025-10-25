package it.uniroma1.song_management_service.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class RoleHeaderFilter extends OncePerRequestFilter {

    private static final String ROLE_HEADER = "X-User-Role"; // The header set by the API Gateway

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String role = request.getHeader(ROLE_HEADER);
        System.out.println("DEBUG: Song Service received X-User-Role header: " + role);

        if (role != null && !role.isEmpty()) {
            // Spring Security requires roles to be prefixed with "ROLE_"
            String authority = "ROLE_" + role.toUpperCase();

            // Create the authentication object
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    "GatewayAuthenticatedUser", // Placeholder principal name
                    null, // No credentials needed
                    Collections.singletonList(new SimpleGrantedAuthority(authority))
            );

            // Set the security context, allowing SecurityConfig to perform checks
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}