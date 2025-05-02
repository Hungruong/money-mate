package com.money.mate.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(nullable = false, unique = true, length = 255)
    private String firebaseUid; 

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password; 

    @Column(length = 100, nullable = false)
    private String userName; 

    @Column(length = 50)
    private String firstName; 

    @Column(length = 50)
    private String lastName;

    @Column(length = 20)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(nullable = false)
    private double autoTradingBalance = 0.0;

    @Column(nullable = false)
    private double manualTradingBalance = 0.0;

    @Column(nullable = false)
    private double income = 0.0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt = new Date();

    @PrePersist
    @PreUpdate
    protected void validateAuthFields() {
        if ((firebaseUid == null || firebaseUid.isBlank()) && (password == null || password.isBlank())) {
            throw new IllegalArgumentException("Either firebaseUid or password must be provided.");
        }
        if (firebaseUid != null && !firebaseUid.isBlank() && password != null && !password.isBlank()) {
            throw new IllegalArgumentException("Only one of firebaseUid or password should be provided.");
        }
        if (firebaseUid == null || firebaseUid.isBlank()) {
            firebaseUid = UUID.randomUUID().toString();
        }
    
        updatedAt = new Date();
    }
}