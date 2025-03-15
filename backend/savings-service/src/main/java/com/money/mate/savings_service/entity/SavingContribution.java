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
@Table(name = "saving_contributions")
public class SavingContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID contributionId;

    @Column(nullable = false)
    private UUID planId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private double amount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date contributionDate = new Date();
}
 