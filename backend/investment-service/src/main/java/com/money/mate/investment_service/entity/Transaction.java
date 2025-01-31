package com.money.mate.investment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue
    private UUID transactionId;

    @ManyToOne
    @JoinColumn(name = "investment_id", nullable = false)
    private Investment investment;

    @Column(nullable = false, length = 50)
    private String type; // "Buy" or "Sell"

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();
}
