package com.money.mate.investment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investment {
    @Id
    @GeneratedValue
    private UUID investmentId;

    @Column(nullable = false)
    private UUID userId; // User who owns the investment

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false, length = 10)
    private String symbol; // Stock symbol

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal quantity; // Number of shares

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal purchasePrice; // Price per share

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice; // Latest stock price

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal closedPrice; // Price at which the stock was closed

    @Column(nullable = false, length = 10)
    private String status; // Status of the investment

    @Column(nullable = false)
    private String type; //buy or sell

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    public void setStatus(String string) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setStatus'");
    }
}
