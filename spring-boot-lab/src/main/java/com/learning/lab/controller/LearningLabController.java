package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/learning")
public class LearningLabController {

    @GetMapping("/di-explained")
    public ApiResponse<String> explainDI() {
        return ApiResponse.success("Dependency Injection involves passing dependencies to objects. Constructor Injection is preferred over Field Injection for easier testing and immutability.", "Success");
    }

    @GetMapping("/scopes")
    public ApiResponse<String> explainScopes() {
        return ApiResponse.success("Singleton is created once per application context. Prototype is created every time it is requested.", "Success");
    }
}
