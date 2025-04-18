package com.money.mate.user_service.service;

import com.money.mate.user_service.entity.User;
import com.money.mate.user_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.money.mate.user_service.dto.ChangePasswordRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection of PasswordEncoder
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }

    public void changePassword(ChangePasswordRequest request) {
        try {
            UUID userId = UUID.fromString("3ef4e5f5-105e-4337-a6d5-934139a44867");
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
    
            System.out.println("User found: " + user.getUserName()); // Log user info
            
            // Validate password match
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                System.out.println("Password mismatch: " + request.getCurrentPassword());
                throw new IllegalArgumentException("Current password is incorrect");
            }
    
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            System.out.println("Password updated successfully for user: " + user.getUserName());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to change password: " + e.getMessage(), e); // Re-throwing the exception with a specific message
        }
    }
    
    
    public User updateUser(UUID userId, User updatedUser) {
        System.out.println("Updating user with ID: " + userId);
        // Retrieve the user from the database
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        System.out.println("Existing user: " + existingUser);

        // Update the fields of the existing user with the new values
        if (updatedUser.getUserName() != null) {
            existingUser.setUserName(updatedUser.getUserName());
        }
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getAvatarUrl() != null) {
            existingUser.setAvatarUrl(updatedUser.getAvatarUrl());
        }
        System.out.println("Updated user: " + existingUser);
        // Save the updated user object
        return userRepository.save(existingUser);
    }
    public User updateManualTradingBalance(UUID userId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        double newBalance = user.getManualTradingBalance() + amount;
        if (newBalance < 0) {
            throw new IllegalArgumentException("Insufficient manual trading balance");
        }
        
        user.setManualTradingBalance(newBalance);
        return userRepository.save(user);
    }

    // Update auto-trading balance
    public User updateAutoTradingBalance(UUID userId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        double newBalance = user.getAutoTradingBalance() + amount;
        if (newBalance < 0) {
            throw new IllegalStateException("Insufficient auto-trading balance for user: " + userId);
        }
        user.setAutoTradingBalance(newBalance);
        return userRepository.save(user);
    }


    public User createUser(User user) {
        // Hash the password before saving it
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        try {
            User savedUser = userRepository.save(user);
            System.out.println("Successfully saved user: " + savedUser);
            return savedUser;
        } catch (Exception e) {
            System.out.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}