package com.money.mate.user_service.controller;

import com.money.mate.user_service.dto.ChangePasswordRequest;
import com.money.mate.user_service.entity.User;
import com.money.mate.user_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.Optional;

@CrossOrigin(origins = "*") // Allow all origins (for testing purposes)
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        System.out.println("Received request to create user: " + user);
        User createdUser = userService.createUser(user); // save the user to the database
        System.out.println("Created user: " + createdUser);
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
    // New endpoint for changing password
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // Call the service to change the password
            userService.changePassword(null, request);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            // If the current password is incorrect
            return ResponseEntity.badRequest().body("Current password is incorrect");
        } catch (Exception e) {
            // If any other error occurs
            return ResponseEntity.status(500).body("An error occurred while updating the password");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
    userService.deleteUser(userId);
    return ResponseEntity.noContent().build();
    }
}