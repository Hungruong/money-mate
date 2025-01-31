package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {
    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<Investment> createInvestment(@RequestBody Investment investment) {
        return ResponseEntity.ok(investmentService.saveInvestment(investment));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Investment>> getUserInvestments(@PathVariable UUID userId) {
        return ResponseEntity.ok(investmentService.getUserInvestments(userId));
    }

    @GetMapping("/investment/{investmentId}")
    public ResponseEntity<Investment> getInvestmentById(@PathVariable UUID investmentId) {
        Optional<Investment> investment = investmentService.getInvestmentById(investmentId);
        return investment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{investmentId}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable UUID investmentId) {
        investmentService.deleteInvestment(investmentId);
        return ResponseEntity.noContent().build();
    }
}
