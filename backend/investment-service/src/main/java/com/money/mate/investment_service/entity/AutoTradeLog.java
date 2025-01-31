package com.money.mate.investment_service.entity;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoTradeLog {
    private UUID logId;
    private UUID userId;
    private UUID investmentId;
    private String symbol;
    private BigDecimal buyPrice;
    private BigDecimal sellPrice;
    private BigDecimal profitLoss;
    private String status; // In Progress, Completed, Failed
    private Instant tradeStartedAt;
    private Instant tradeCompletedAt;
}
