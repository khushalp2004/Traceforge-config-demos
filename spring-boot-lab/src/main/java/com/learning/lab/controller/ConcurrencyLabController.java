package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

@RestController
@RequestMapping("/concurrency")
public class ConcurrencyLabController {

    private int sharedCounter = 0;
    private int lockedCounter = 0;
    private final ReentrantLock lock = new ReentrantLock();

    @GetMapping("/race-condition")
    public ApiResponse<String> raceCondition() throws InterruptedException {
        sharedCounter = 0;
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        for (int i = 0; i < 1000; i++) {
            executor.submit(() -> sharedCounter++);
        }
        
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        
        return ApiResponse.success("Expected 1000, Actual: " + sharedCounter, "Success");
    }

    @GetMapping("/fixed-race-condition")
    public ApiResponse<String> fixedRaceCondition() throws InterruptedException {
        lockedCounter = 0;
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        for (int i = 0; i < 1000; i++) {
            executor.submit(() -> {
                lock.lock();
                try {
                    lockedCounter++;
                } finally {
                    lock.unlock();
                }
            });
        }
        
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        
        return ApiResponse.success("Expected 1000, Actual: " + lockedCounter, "Success");
    }
}
