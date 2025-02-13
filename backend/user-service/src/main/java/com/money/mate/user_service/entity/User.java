package com.money.mate.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.util.Date;

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

    @Column( nullable =  false, unique = true, length = 255)
    private String firebaseUid;

    @Column(nullable = false, unique = true, length = 100)

    private String email;
    private String userName;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;

    @Column(nullable = false)
    private double income = 0.0;

    @Column(nullable = false)
    private double manualTradingBalance = 0.0;

    @Column(nullable = false)
    private double autoTradingBalance = 0.0;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private double totalExpense = 0.0;

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
