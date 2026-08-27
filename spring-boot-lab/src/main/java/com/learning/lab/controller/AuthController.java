package com.learning.lab.controller;

import com.learning.lab.dto.ApiResponse;
import com.learning.lab.dto.AuthRequest;
import com.learning.lab.dto.UserRequest;
import com.learning.lab.fakeDatabase.FakeUserRepository;
import com.learning.lab.model.User;
import com.learning.lab.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final FakeUserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, FakeUserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already in use", "EMAIL_IN_USE"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // Plain text for demo purposes
                .role(request.getRole() != null ? request.getRole() : "USER")
                .build();
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(savedUser, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(ApiResponse.success(token, "Login successful"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> profile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return ResponseEntity.ok(ApiResponse.success(user, "Profile fetched successfully"));
    }
}
