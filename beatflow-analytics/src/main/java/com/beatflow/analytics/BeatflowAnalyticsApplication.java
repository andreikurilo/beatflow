package com.beatflow.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication(scanBasePackages = "com.beatflow")
@EnableKafka
public class BeatflowAnalyticsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeatflowAnalyticsApplication.class, args);
    }
}
