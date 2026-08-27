package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/performance")
public class PerformanceLabController {

    private static final List<Object> leakList = new ArrayList<>();

    @GetMapping("/cpu")
    public ApiResponse<String> cpuIntensive() {
        long start = System.currentTimeMillis();
        double dummy = 0;
        for (int i = 0; i < 10000000; i++) {
            dummy += Math.sin(i) * Math.cos(i);
        }
        long end = System.currentTimeMillis();
        return ApiResponse.success("Calculated dummy value: " + dummy + " in " + (end - start) + "ms", "Success");
    }

    @GetMapping("/memory-leak")
    public ApiResponse<String> memoryLeak() {
        // Intentionally leak memory by adding 10MB of data
        byte[] data = new byte[10 * 1024 * 1024]; 
        leakList.add(data);
        return ApiResponse.success("Added 10MB to leakList. Total items: " + leakList.size(), "Success");
    }

    @GetMapping("/sleep")
    public ApiResponse<String> sleep() throws InterruptedException {
        TimeUnit.SECONDS.sleep(2);
        return ApiResponse.success("Woke up after 2 seconds", "Success");
    }
}
