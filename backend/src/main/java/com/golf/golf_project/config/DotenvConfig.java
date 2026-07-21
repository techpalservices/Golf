package com.golf.golf_project.config;

import java.io.File;
import java.util.Map;
import java.util.stream.Collectors;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        String userDir = System.getProperty("user.dir");

        // Try the current working directory first, then /backend subdirectory
        String[] pathsToTry = {
                userDir,
                userDir + File.separator + "backend"
        };

        Dotenv dotenv = null;
        for (String path : pathsToTry) {
            File envFile = new File(path, ".env");
            if (envFile.exists()) {
                dotenv = Dotenv.configure()
                        .directory(path)
                        .load();
                break;
            }
        }

        // Fallback: ignore if missing (no .env found at all)
        if (dotenv == null) {
            dotenv = Dotenv.configure()
                    .directory(".")
                    .ignoreIfMissing()
                    .load();
        }

        ConfigurableEnvironment environment = applicationContext.getEnvironment();

        Map<String, Object> dotenvMap =
                dotenv.entries().stream().collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));

        environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", dotenvMap));
    }
}
