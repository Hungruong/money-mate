package com.money.mate.investment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
// map to database table, you can easily use Spring built-in function to interact with the database instead of manually writing the SQL queries
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

    @Column(nullable = false, length = 10)
    private String symbol; // Stock symbol

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(name="total_bought_quantity", nullable = false, precision = 12, scale = 4)
    private BigDecimal totalBoughtQuantity; // Total number of shares bought

    @Column(name="total_sold_quantity", nullable = false, precision = 12, scale = 4)
    private BigDecimal totalSoldQuantity; // Total number of shares sold

    @Column(name="current_quantity", nullable = false, precision = 12, scale = 4)
    private BigDecimal currentQuantity; // Current number of shares 

    @Column(name="average_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal averagePrice; // Average price of the stock

    @Column(name="allocated_capital", nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedCapital; // Total capital allocated

    @Column(name="current_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentValue; // Current value of the investment

    @Enumerated(EnumType.STRING)
    @Column(name="type", nullable = false, length = 10)
    private InvestmentType type; // manual or auto

    @Column(name="strategy", nullable = false, length = 10) 
    private String strategy; // value or growth

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false, length = 10)   
    private InvestmentStatus status; // active or inactive

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now(); // Timestamp for when the investment was created

    @Column(name = "updated_at")
    private Instant updatedAt; // Timestamp for when the investment was last updated

    public enum InvestmentType {
        MANUAL, AUTO
    }

    public enum InvestmentStatus { 
        ACTIVE, 
        CLOSED, 
        PAUSED, 
        STOPPED 
    }
}
