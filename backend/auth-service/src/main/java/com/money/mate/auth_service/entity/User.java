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
    private String firebaseUid; // UID from Firebase Authentication

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;  // Only stored if Firebase isn't used for auth

    @Column(length = 100)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(nullable = false, columnDefinition = "DECIMAL(12,2) DEFAULT 0.0")
    private double income = 0.0;

    @Column(nullable = false, columnDefinition = "DECIMAL(12,2) DEFAULT 0.0")
    private double manualTradingBalance = 0.0;

    @Column(nullable = false, columnDefinition = "DECIMAL(12,2) DEFAULT 0.0")
    private double autoTradingBalance = 0.0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt = new Date();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
