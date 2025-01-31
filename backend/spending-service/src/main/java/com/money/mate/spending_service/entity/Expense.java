package com.money.mate.spending_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID expenseId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(length = 255)
    private String description;

    @Column
    private String receiptUrl; // Stored in S3

    @Temporal(TemporalType.TIMESTAMP)
    private Date date = new Date();
}
