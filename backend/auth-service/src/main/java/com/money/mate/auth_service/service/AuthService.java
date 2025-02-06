package com.money.mate.auth_service.service;

import com.money.mate.auth_service.entity.User;
import com.money.mate.auth_service.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }

        // Check if Firebase UID is already registered
        if (userRepository.findByFirebaseUid(user.getFirebaseUid()).isPresent()) {
            return "Firebase UID already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password
        userRepository.save(user);
        return "User registered successfully!";
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
