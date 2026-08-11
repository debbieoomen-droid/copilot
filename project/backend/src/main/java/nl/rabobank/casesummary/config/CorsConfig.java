package nl.rabobank.casesummary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuratie zodat de vanilla HTML/CSS/JS starter
 * (geserveerd via Live Server op poort 5501) de backend kan bereiken.
 *
 * Voeg extra origins toe als je de frontend op een andere poort serveert.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:5501",
                        "http://127.0.0.1:5501",
                        "http://localhost:5500",   // VS Code Live Server default
                        "http://127.0.0.1:5500",
                        "http://localhost:3000",   // React dev server (starter-project frontend)
                        "http://127.0.0.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
