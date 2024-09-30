package com.vnmaudev.api_gateway.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfiguration {
    @Bean
    public CorsFilter corsFilter() {
        org.springframework.web.cors.CorsConfiguration corsConfiguration =
                new org.springframework.web.cors.CorsConfiguration();

        // Chỉ cho phép origin http://localhost:3000
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
