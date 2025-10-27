package it.uniroma1.api_gateway.filter;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import it.uniroma1.api_gateway.config.JwtConfig;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtConfig jwtConfig;

    public JwtAuthenticationFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();
        String method = request.getMethod().name();

        // Log the request for debugging
        System.out.println("=== Gateway Filter ===");
        System.out.println("Path: " + path);
        System.out.println("Method: " + method);

        // Skip authentication for public paths
        if (isPublicPath(path, method)) {
            System.out.println("Public path - skipping JWT validation");
            return chain.filter(exchange);
        }

        // Extract token from Authorization header
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        System.out.println("Authorization header: " + authHeader);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Missing or invalid Authorization header");
            return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            System.out.println("JWT validated successfully");
            System.out.println("User: " + claims.getSubject());
            System.out.println("Role: " + claims.get("role", String.class));

            // Add user info to request headers for downstream services
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", claims.get("userId", String.class))
                    .header("X-User-Name", claims.getSubject())
                    .header("X-User-Role", claims.get("role", String.class))
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (ExpiredJwtException e) {
            System.out.println("JWT token expired");
            return onError(exchange, "JWT token expired", HttpStatus.UNAUTHORIZED);
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token format");
            return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
        } catch (JwtException e) {
            System.out.println("JWT validation failed: " + e.getMessage());
            return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Check if the path is public (doesn't require authentication)
     */
    private boolean isPublicPath(String path, String method) {
        // Authentication endpoints
        if (path.equals("/auth/login") || path.equals("/auth/register")) {
            return true;
        }

        // Public song browsing (GET only)
        if (method.equals("GET")) {
            if (path.equals("/songs") || 
                path.matches("/songs/[^/]+") || 
                path.startsWith("/songs/artist/")||
                path.startsWith("/songs/search/")|| 
                path.startsWith("/songs/trending/")||
                path.startsWith("/songs/recent/")
                ) {
                return true;
            }
        }

        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");
        
        String errorResponse = String.format("{\"error\": \"%s\", \"status\": %d}", 
                                            message, status.value());
        
        System.out.println("Returning error: " + errorResponse);
        
        return response.writeWith(
            Mono.just(response.bufferFactory().wrap(errorResponse.getBytes()))
        );
    }

    @Override
    public int getOrder() {
        return -100; // High priority
    }
}