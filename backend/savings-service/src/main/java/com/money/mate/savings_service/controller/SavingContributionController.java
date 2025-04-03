package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingContribution;
import com.money.mate.savings_service.service.SavingContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/contributions")
public class SavingContributionController {

    @Autowired
    private SavingContributionService service;

    @PostMapping
    public ResponseEntity<SavingContribution> createContribution(@RequestBody SavingContribution contribution) {
        SavingContribution createdContribution = service.createContribution(contribution);
        return ResponseEntity.ok(createdContribution);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingContribution> getContribution(@PathVariable UUID id) {
        Optional<SavingContribution> contribution = service.getContribution(id);
        return contribution.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContribution(@PathVariable UUID id) {
        service.deleteContribution(id);
        return ResponseEntity.noContent().build();
    }
}