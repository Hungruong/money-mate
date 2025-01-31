package com.money.mate.spending_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bill_splits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillSplit {
    @Id
    @GeneratedValue
    private UUID splitId;

    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = false)
    private GroupBill bill;

    @Column(nullable = false)
    private UUID userId; // User assigned for the split

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amountOwed;

    @Column(nullable = false)
    @Builder.Default
    private boolean paid = false;

    private Instant paidAt;
}
