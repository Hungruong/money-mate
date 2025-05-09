package com.money.mate.user_service.controller;

import com.money.mate.user_service.dto.ChangePasswordRequest;
import com.money.mate.user_service.entity.User;
import com.money.mate.user_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

record UpdateUserRequest(UUID userId, double amount) {}

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable UUID userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return userService.getUserByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phone")
    public ResponseEntity<User> getUserByPhoneNumber(@RequestParam String phoneNumber) {
        return userService.getUserByPhoneNumber(phoneNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable UUID userId, @RequestBody User updatedUser) {
        updatedUser.setUserId(userId);
        return ResponseEntity.ok(userService.updateUser(userId, updatedUser));
    }

    @PutMapping("/{userId}/manual-trading-balance")
    public ResponseEntity<User> updateManualTradingBalance(
            @PathVariable UUID userId,
            @RequestBody UpdateUserRequest updateRequest) {
        return ResponseEntity.ok(userService.updateManualTradingBalance(userId, updateRequest.amount()));
    }

    @PutMapping("/{userId}/auto-trading-balance")
    public ResponseEntity<User> updateAutoTradingBalance(
            @PathVariable UUID userId,
            @RequestBody UpdateUserRequest updateRequest) {
        return ResponseEntity.ok(userService.updateAutoTradingBalance(userId, updateRequest.amount()));
            }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while updating the password");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}