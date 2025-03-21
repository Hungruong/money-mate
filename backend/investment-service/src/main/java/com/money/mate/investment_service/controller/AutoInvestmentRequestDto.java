package com.money.mate.investment_service.controller;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class AutoInvestmentRequestDto {
    private UUID userId;
    private String strategy;
    private BigDecimal amount;

}