package com.golf.golf_project.config;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serves files stored in the ./uploads folder when requested via /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
