package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(length = 500)
    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime contributionDate = LocalDateTime.now();
}