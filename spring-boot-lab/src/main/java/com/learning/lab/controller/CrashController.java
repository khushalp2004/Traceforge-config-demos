package com.learning.lab.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CrashController {

    @GetMapping("/learning/crash")
    public String crash() {
        int x = 1 / 0; // Boom!
        return "Crash";
    }
}
