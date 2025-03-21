package com.money.mate.investment_service.controller;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class AutoInvestmentRequestDto {
    private UUID userId;
    private String strategy;
    private BigDecimal amount;

    // Optional: You might want additional fields specific to auto-trading
    // private String frequency; // e.g., "DAILY", "WEEKLY"
    // private LocalDateTime startDate;
}