package com.nigus.card_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // For now: allow everything (so you can keep testing without token)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()           // ← temporary: change to .authenticated() later
                )
                // Prepare for JWT validation (this line is important — Spring will know how to read Bearer tokens)
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
                // Disable CSRF (normal for REST APIs)
                .csrf(AbstractHttpConfigurer::disable)
                // No sessions — pure token-based
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}