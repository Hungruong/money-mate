package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingContribution;
import com.money.mate.savings_service.service.SavingContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contributions")
public class SavingContributionController {

    @Autowired
    private SavingContributionService service;

    @PostMapping
    public ResponseEntity<SavingContribution> createContribution(@RequestBody SavingContribution contribution) {
        SavingContribution created = service.createContribution(contribution);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingContribution> getContribution(@PathVariable UUID id) {
        return service.getContribution(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<SavingContribution>> listContributions() {
        List<SavingContribution> contributions = service.listContributions();
        return ResponseEntity.ok(contributions);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<SavingContribution>> listByPlanId(@PathVariable UUID planId) {
        List<SavingContribution> contributions = service.listByPlanId(planId);
        return ResponseEntity.ok(contributions);
    }

    @GetMapping("/plan/{planId}/user/{userId}")
    public ResponseEntity<List<SavingContribution>> listByPlanIdAndUserId(
            @PathVariable UUID planId, 
            @PathVariable UUID userId) {
        List<SavingContribution> contributions = service.listByPlanIdAndUserId(planId, userId);
        return ResponseEntity.ok(contributions);
    }
}