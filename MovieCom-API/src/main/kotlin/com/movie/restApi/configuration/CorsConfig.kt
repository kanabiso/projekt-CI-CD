package com.movie.restApi.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig {
    @Bean
    fun corsConfigure(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**") // Dopuszcza wszystkie endpointy
                    .allowedOrigins("http://localhost:3000") // Zezwala na dostęp z tej domeny
                    .allowedOrigins("http://localhost:80")
                    .allowedOrigins("http://localhost:8080")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Dopuszcza określone metody HTTP
                    .allowedHeaders("*") // Dopuszcza wszystkie nagłówki
                    .allowCredentials(true) // Zezwala na uwierzytelnienie (np. ciasteczka)
            }
        }
    }
}