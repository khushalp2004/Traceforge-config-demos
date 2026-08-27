package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import com.learning.lab.exception.ValidationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/errors")
public class ErrorLabController {

    @GetMapping("/null-pointer")
    public ApiResponse<Void> triggerNullPointer() {
        String test = null;
        test.length(); // Triggers NPE
        return ApiResponse.success(null, "Will not reach here");
    }

    @GetMapping("/index")
    public ApiResponse<Void> triggerIndexOutOfBounds() {
        List<String> list = new ArrayList<>();
        list.get(100); // Triggers Exception
        return ApiResponse.success(null, "Will not reach here");
    }

    @GetMapping("/number")
    public ApiResponse<Void> triggerNumberFormat() {
        Integer.parseInt("abc"); // Triggers Exception
        return ApiResponse.success(null, "Will not reach here");
    }

    @GetMapping("/class-cast")
    public ApiResponse<Void> triggerClassCast() {
        Object obj = "String value";
        Integer num = (Integer) obj; // Triggers ClassCastException
        return ApiResponse.success(null, "Will not reach here");
    }

    @GetMapping("/validation")
    public ApiResponse<Void> triggerValidation() {
        throw new ValidationException("Intentionally thrown validation failure");
    }
}
