package com.money.mate.splitting_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.ArrayList;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API requests
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allow all requests (TEMP TEST)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless
                                                                                                               // sessions
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Generate all possible development URLs
        List<String> allowedOrigins = getAllowedOrigins();

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private List<String> getAllowedOrigins() {
        List<String> origins = new ArrayList<>();

        // Add standard development ports
        origins.add("http://localhost:8081"); // React Native/Expo web default
        origins.add("http://127.0.0.1:8081");

        // Add Expo development ports (19000-19006)
        IntStream.rangeClosed(19000, 19006).forEach(port -> {
            origins.add("http://localhost:" + port);
            origins.add("http://127.0.0.1:" + port);
        });

        // Add Android emulator origins
        IntStream.rangeClosed(19000, 19006).forEach(port -> {
            origins.add("http://10.0.2.2:" + port);
        });
        origins.add("http://10.0.2.2:8081");

        // Add development machine's IP if specified in environment
        String devMachineIp = System.getenv("DEV_MACHINE_IP");
        if (devMachineIp != null && !devMachineIp.isEmpty()) {
            origins.add("http://" + devMachineIp + ":8081");
            IntStream.rangeClosed(19000, 19006).forEach(port -> {
                origins.add("http://" + devMachineIp + ":" + port);
            });
        }

        return origins;
    }
}