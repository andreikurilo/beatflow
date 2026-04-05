package com.beatflow.playback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.beatflow")
public class BeatflowPlaybackApplication {
    public static void main(String[] args) {
        SpringApplication.run(BeatflowPlaybackApplication.class, args);
    }
}
