package it.uniroma1.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class PreAuthFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Use exchange.getPrincipal() to retrieve the authenticated user
        return exchange.getPrincipal()
                // The principal is a JwtAuthenticationToken after successful Resource Server validation
                .cast(JwtAuthenticationToken.class)
                .map(JwtAuthenticationToken::getToken)
                .flatMap(jwt -> {
                    // 1. Extract the 'userId' and 'role' claims from the JWT
                    String userId = jwt.getClaimAsString("userId");
                    String role = jwt.getClaimAsString("role");

                    // 2. Mutate the request to add the headers
                    ServerHttpRequest request = exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Role", role)
                            .build();

                    // 3. Continue the filter chain with the modified request
                    return chain.filter(exchange.mutate().request(request).build());
                })
                // If no principal is present (e.g., on a public path like /auth/login), continue as usual
                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        // Set a low negative order to ensure this filter runs after Spring Security's
        // OAuth2 Resource Server filter (which typically has an order of -200).
        return -150;
    }
}