package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saving_goals")
public class SavingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID goalId;

    @Column(nullable = false)
    private UUID planId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private double amount;


    @Column(nullable = false)
    private LocalDate deadline;

    @Column(nullable = false)
    private String ruleDescription;


}
