package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bugs")
public class BugPlaygroundController {

    @GetMapping("/stack-overflow")
    public ApiResponse<String> stackOverflow() {
        recursiveCall();
        return ApiResponse.success("Won't reach here", "Success");
    }

    private void recursiveCall() {
        recursiveCall();
    }
}
