package com.money.mate.auth_service.service;

import com.money.mate.auth_service.entity.User;
import com.money.mate.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User signUp(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already in use.");
        });

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    public User signIn(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }

    public Optional<User> signInWithFirebase(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }
}
