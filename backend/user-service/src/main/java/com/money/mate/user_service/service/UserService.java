package com.money.mate.user_service.service;

import com.money.mate.user_service.entity.User;
import com.money.mate.user_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }

    public User updateUser(User updatedUser) {
        return userRepository.save(updatedUser);
    }

    public User createUser(User user) {
        System.out.println("About to save user: " + user);
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
