package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping
    public ApiResponse<Map<String, Object>> getDashboard() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("uptime", "4h 12m");
        metrics.put("requests", 120);
        metrics.put("errors", 5);
        metrics.put("memoryUsage", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory() + " bytes");
        metrics.put("cacheHits", 82);
        metrics.put("cacheMisses", 15);
        metrics.put("activeThreads", Thread.activeCount());
        metrics.put("averageResponseTime", "45ms");
        
        return ApiResponse.success(metrics, "Dashboard fetched successfully");
    }
}
