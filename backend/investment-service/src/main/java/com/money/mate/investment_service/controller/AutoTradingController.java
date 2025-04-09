package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStrategy;
import com.money.mate.investment_service.service.AutoTradingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/autotrading")
public class AutoTradingController {

    private static final Logger logger = LoggerFactory.getLogger(AutoTradingController.class);

    @Autowired
    private AutoTradingService autoTradingService;

    @GetMapping("/investments/{userId}")
    public ResponseEntity<List<Investment>> getUserInvestments(@PathVariable UUID userId) {
        logger.info("Fetching investments for userId: {}", userId);
        try {
            List<Investment> investments = autoTradingService.getInvestmentsByUserId(userId);
            if (investments.isEmpty()) {
                logger.info("No investments found for userId: {}", userId);
            } else {
                logger.info("Found {} investments for userId: {}", investments.size(), userId);
            }
            return ResponseEntity.ok(investments);
        } catch (Exception e) {
            logger.error("Failed to fetch investments for userId: {}", userId, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/start")
    public ResponseEntity<Investment> startStrategy(@RequestBody AutoInvestmentRequestDto request) {
        try {
            InvestmentStrategy invStrategy = InvestmentStrategy.valueOf(request.getStrategy().toLowerCase());
            Investment investment = autoTradingService.startStrategy(
                    request.getUserId(),
                    invStrategy,
                    request.getAmount());
            return ResponseEntity.ok(investment);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(null); // Could include e.getMessage() in a custom response
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Invalid strategy
        }
    }

    @PostMapping("/pause/{userId}")
    public ResponseEntity<String> pauseStrategy(@PathVariable UUID userId) {
        try {
            autoTradingService.pauseStrategy(userId);
            return ResponseEntity.ok("Strategy paused for user: " + userId);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Failed to pause strategy: " + e.getMessage());
        }
    }

    @PostMapping("/stop/{userId}")
    public ResponseEntity<String> stopStrategy(@PathVariable UUID userId) {
        try {
            autoTradingService.stopStrategy(userId);
            return ResponseEntity.ok("Strategy stopped for user: " + userId);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Failed to stop strategy: " + e.getMessage());
        }
    }

    @PostMapping("/resume/{userId}")
    public ResponseEntity<String> resumeStrategy(@PathVariable UUID userId) {
        try {
            autoTradingService.resumeStrategy(userId);
            return ResponseEntity.ok("Strategy resumed for user: " + userId);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Failed to resume strategy: " + e.getMessage());
        }
    }

    @PostMapping("/close/{userId}")
    public ResponseEntity<String> closeStrategy(@PathVariable UUID userId) {
        try {
            autoTradingService.closeStrategy(userId);
            return ResponseEntity.ok("Strategy closed for user: " + userId); // Fixed message
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Failed to close strategy: " + e.getMessage());
        }
    }

    @PostMapping("/sell/{userId}/{symbol}")
    public ResponseEntity<String> manualSell(
            @PathVariable UUID userId,
            @PathVariable String symbol,
            @RequestBody ManualSellRequest request) {
        try {
            autoTradingService.manualSell(userId, symbol, request.getQuantity());
            return ResponseEntity.ok("Manual sell executed for symbol: " + symbol + " for user: " + userId);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Failed to execute manual sell: " + e.getMessage());
        }
    }

    // DTO for manual sell request
    public static class ManualSellRequest {
        private BigDecimal quantity;

        public BigDecimal getQuantity() {
            return quantity;
        }

        public void setQuantity(BigDecimal quantity) {
            this.quantity = quantity;
        }
    }
}