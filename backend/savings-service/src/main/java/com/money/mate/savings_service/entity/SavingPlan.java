package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saving_plans")
public class SavingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID planId;

    @Column(nullable = false, length = 20)
    private String planType; // Individual or Group

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private double targetAmount;

    @Column(nullable = false)
    private double currentAmount = 0.0;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date endDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();
}
