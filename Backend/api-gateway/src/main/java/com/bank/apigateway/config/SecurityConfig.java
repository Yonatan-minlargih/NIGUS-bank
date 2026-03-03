package com.bank.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // Allow public endpoints (Swagger, actuator, etc.)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/webjars/**").permitAll()
                        .anyExchange().authenticated()
                )

                // Enable JWT validation
                .oauth2ResourceServer(oauth2 -> oauth2.jwt())

                // Disable CSRF (not needed for stateless API gateway)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Optional: CORS if frontend is separate domain
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.addAllowedOrigin("*"); // tighten in production
                    corsConfig.addAllowedMethod("*");
                    corsConfig.addAllowedHeader("*");
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }));

        return http.build();
    }
}