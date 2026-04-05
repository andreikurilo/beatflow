package com.beatflow.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.beatflow")
public class BeatflowAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeatflowAuthApplication.class, args);
    }
}
