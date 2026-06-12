package com.nextbuy.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NextBuyApplication {

    public static void main(String[] args) {
        SpringApplication.run(NextBuyApplication.class, args);
    }
}