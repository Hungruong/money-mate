package com.money.mate.auth_service.controller;

import com.money.mate.auth_service.entity.User;
import com.money.mate.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody User user) {
        User createdUser = authService.signUp(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<User> signIn(@RequestParam String email, @RequestParam String password) {
        User authenticatedUser = authService.signIn(email, password);
        return ResponseEntity.ok(authenticatedUser);
    }
}