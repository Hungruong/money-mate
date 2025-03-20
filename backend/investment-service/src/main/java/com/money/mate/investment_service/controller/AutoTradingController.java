package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStrategy;
import com.money.mate.investment_service.service.AutoTradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/autotrading")
public class AutoTradingController {
    @Autowired
    private AutoTradingService autoTradingService;

    @PostMapping("/start")
    public ResponseEntity<List<Investment>> startStrategy(
            @RequestParam UUID userId,
            @RequestParam String strategy,
            @RequestParam BigDecimal capital) {
        InvestmentStrategy invStrategy = InvestmentStrategy.valueOf(strategy.toLowerCase());
        List<Investment> investments = autoTradingService.startStrategy(userId, invStrategy, capital);
        return ResponseEntity.ok(investments);
    }

    @PostMapping("/pause/{userId}")
    public ResponseEntity<String> pauseStrategy(@PathVariable UUID userId) {
        autoTradingService.pauseStrategy(userId);
        return ResponseEntity.ok("Strategy paused for user: " + userId);
    }

    @PostMapping("/stop/{userId}")
    public ResponseEntity<String> stopStrategy(@PathVariable UUID userId) {
        autoTradingService.stopStrategy(userId);
        return ResponseEntity.ok("Strategy stopped for user: " + userId);
    }

    @PostMapping("/resume/{userId}")
    public ResponseEntity<String> resumeStrategy(@PathVariable UUID userId) {
        autoTradingService.resumeStrategy(userId);
        return ResponseEntity.ok("Strategy resumed for user: " + userId);
    }
}