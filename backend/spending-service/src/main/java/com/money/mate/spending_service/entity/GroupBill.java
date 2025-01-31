package com.money.mate.spending_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "group_bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupBill {
    @Id
    @GeneratedValue
    private UUID billId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private UUID createdBy; // User who created the bill

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "Not Done"; // Done or Not Done

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
