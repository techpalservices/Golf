package com.golf.golf_project;

import com.golf.golf_project.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GolfProjectApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(GolfProjectApplication.class);
        app.addInitializers(new DotenvConfig());
        app.run(args);
    }

}
