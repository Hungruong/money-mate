package com.money.mate.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Define and return the BCryptPasswordEncoder bean
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:8081", "http://10.0.2.2:8081")); // Frontend URLs
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH")); // HTTP methods allowed
                config.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Headers allowed
                return config;
            }))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API requests
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/**").permitAll() // Allow access to API endpoints
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // No sessions
        return http.build();
    }
}
