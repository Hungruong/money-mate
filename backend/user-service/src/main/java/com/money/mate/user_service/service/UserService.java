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

    public User changePassword(UUID userId, ChangePasswordRequest request) {
        // Retrieve the user by ID
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Validate the current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), existingUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Hash and update the new password
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
        existingUser.setPassword(hashedNewPassword);

        // Save the updated user
        return userRepository.save(existingUser);
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
        if (updatedUser.getPassword() != null) {
            // Hash the password before saving it
            String hashedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(hashedPassword); // Update password if provided
        }
        if (updatedUser.getAvatarUrl() != null) {
            existingUser.setAvatarUrl(updatedUser.getAvatarUrl());
        }
        System.out.println("Updated user: " + existingUser);
        // Save the updated user object
        return userRepository.save(existingUser);
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