package com.money.mate.investment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.OptimisticLockType;
import org.hibernate.annotations.OptimisticLocking;

@Entity
@DynamicUpdate
@OptimisticLocking(type = OptimisticLockType.ALL)
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID transactionId;

    @ManyToOne
    @JoinColumn(name = "investment_id", nullable = false)
    private Investment investment;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    private TransactionType type; // buy or sell

    @Column(name = "quantity", nullable = false, precision = 12, scale = 4)
    private BigDecimal quantity; // number of shares

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price; // price of the stock

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount; // total amount of the transaction

    @Column(name = "timestamp", nullable = false, updatable = false)
    @Builder.Default
    private Instant timestamp = Instant.now(); // Timestamp of the transansaction

    public enum TransactionType {
        BUY,
        SELL
    }

    @Version
    private Long version;

}
