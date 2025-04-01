package com.money.mate.savings_service.entity;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
